import bitstring
import json
import serial


class Analyser:
    # Consts
    ORIENTATIONS = ['x', 'y', 'z']

    INCORRECT_DIRECTION = 1
    MAX_TRANSITION_LENGTH_EXCEEDED = 2
    MAX_INDEXES_DELTA_EXCEEDED = 3
    CONSTANT_LIMIT_EXCEEDED = 4

    MAX_TRANSITION_LENGTH = 3
    MAX_INDEXES_DELTA = 5

    WAITING_INIT_STATE = 1
    DOING_EXERCISE = 2

    def __init__(self, file_name, exercise_info, rdr):
        data = json.load(open(file_name))
        self.mainPlot = data["main"]
        self.stateCount = exercise_info["stateCount"]
        self.sensorCount = 4
        # Массивы с эталонами координат
        self.references = data['references']
        print(data)
        self.reader = rdr

    def process_data(self): # Analyze state
        self.lastError = None
        data = self.reader.read()
        if self.state == self.WAITING_INIT_STATE:
            self.process_init_state(data)
        elif self.state == self:
            self.step(data)
        stateRes = self.calc_state()
        if stateRes == self.stateCount:
            self.init_params()
        return {"stateRes": stateRes, "error": self.lastError != None}

    def calc_state(self):
        id = self.main["id"]
        orient = self.main["orientation"]
        arrayLen = len(self.references[id][orient])
        idx = self.indexes[id][orient]
        return int(idx / float(arrayLen / self.stateCount))

    def step(self, data):
        id = data['id']

        for orientation in self.ORIENTATIONS:
            item = self.references[id][orientation]
            self.change_index(id, orientation, data[orientation])
            if not self.check_indexes():
                self.error(self.MAX_INDEXES_DELTA_EXCEEDED)

            if item['is_const'] and not self.check_const(item['min'], item['max'], data[orientation]):
                print ('const limit error', item['min'], item['max'], data[orientation])
                self.error(self.CONSTANT_LIMIT_EXCEEDED)

        print (self.indexes[2]['x'])

        if data['id'] == 2:
            print ('coord', data['x'])

    def change_index(self, id, orientation, val):
        ind = self.indexes[id][orientation]
        ref = self.references[id][orientation]['values']

        # Если дошли до последнего элемента, прекращаем обработку
        if ind >= len(ref) - 1:
            if not self.references[id][orientation]['is_const']:
                self.init_params()
            return

        # if abs(ref[ind + 1] - val) <= abs(ref[ind] - val):
        #     new_ind = ind + 1
        # else:
        #     new_ind = ind

        new_ind = ind

        while new_ind < len(ref) - 1 and abs(ref[new_ind + 1] - val) <= abs(ref[new_ind] - val):
            new_ind += 1

        if new_ind > ind:
            if new_ind > ind + self.MAX_TRANSITION_LENGTH:
                self.error(self.MAX_TRANSITION_LENGTH_EXCEEDED)
            else:
                self.indexes[id][orientation] = new_ind
                return

        if ind == 0:
            return

        if ref[ind] > ref[ind - 1]:
            if val <= ref[ind - 1]:
                self.error(self.INCORRECT_DIRECTION)
        else:
            if val >= ref[ind - 1]:
                self.error(self.INCORRECT_DIRECTION)

    def init_params(self):
        # Указатели на текущий элемент в эталоне
        self.indexes = []
        for i in range(self.sensor_count):
            index = {}
            for orientation in self.ORIENTATIONS:
                index[orientation] = 0

            self.indexes.append(index)

        self.state = self.WAITING_INIT_STATE

        self.init_data = {}

    def check_indexes(self):
        min_perc = len(self.references[0][self.ORIENTATIONS[0]])
        max_perc = 0

        for i in range(len(self.indexes)):
            for orientation in self.indexes[i]:
                if not self.references[i][orientation]['is_const']:
                    perc = self.indexes[i][orientation] / len(self.references[i][orientation]['values'])
                    min_perc = min(min_perc, perc)
                    max_perc = max(max_perc, perc)

        return max_perc - min_perc < self.MAX_INDEXES_DELTA

    def error(self, err):
        # TODO: Добавить обработку ошибок

        if err == self.INCORRECT_DIRECTION:
            print ('Incorrect direction')
        elif err == self.MAX_TRANSITION_LENGTH_EXCEEDED:
            print ('Max transition length exceeded')
        elif err == self.MAX_INDEXES_DELTA_EXCEEDED:
            print ('Max indexes delta exceeded')

        self.init_params()

    def is_init_state(self):
        for id in range(self.sensor_count):
            if id in self.init_data:
                for orientation in self.ORIENTATIONS:
                    if self.references[id][orientation]['is_const']:
                        l = self.references[id][orientation]['min']
                        r = self.references[id][orientation]['max']
                    else:
                        l = min(self.references[id][orientation]['values'][0], self.references[id][orientation]['values'][1])
                        r = max(self.references[id][orientation]['values'][0], self.references[id][orientation]['values'][1])

                        if not l <= self.init_data[id][orientation] <= r:
                            return False
            else:
                return False

        return True

    def process_init_state(self, data):
        id = data['id']
        del data['id']
        self.init_data[id] = data
        if self.is_init_state():
            self.state = self.DOING_EXERCISE
            print ("Init state")

    def check_const(self, min, max, val):
        return min <= val <= max


class Reader:
    DATA_SIZE = 8
    MSG_BEGIN_SIZE = 8
    BEGIN_SYMBOL = 0xff
    SMOOTH_INDEX = 10
    HAVE_ENOUGH_DATA = {0: False, 1: False, 2: False, 3: False}
    cache = [{'id': 0, 'x': [], 'y': [], 'z': []}, {'id': 1, 'x': [], 'y': [], 'z': []},
             {'id': 2, 'x': [], 'y': [], 'z': []}, {'id': 3, 'x': [], 'y': [], 'z': []}]

    def __init__(self, com):
        self.com = com
        self.ser = serial.Serial(com)

    def process_read(self):
        while True:
            cur_data = self.read()
            self.update_cache(cur_data)
            id = cur_data['id']
            #print(id)  #          if self.HAVE_ENOUGH_DATA[id] == True:
            x = int(sum(self.cache[id]['x']) / self.SMOOTH_INDEX)
            y = int(sum(self.cache[id]['y']) / self.SMOOTH_INDEX)
            z = int(sum(self.cache[id]['z']) / self.SMOOTH_INDEX)

            rd = {'id': id, 'x': x, 'y': y, 'z': z}
            #print(rd)
            return rd

    def update_cache(self, data):
        id = data['id']
        lenx = len(self.cache[id]['x'])
        if lenx == self.SMOOTH_INDEX:
            self.cache[id]['x'] = self.cache[id]['x'][1:self.SMOOTH_INDEX]
            self.HAVE_ENOUGH_DATA[id] = True
        self.cache[id]['x'].append(data['x'])

        leny = len(self.cache[id]['y'])
        if leny == self.SMOOTH_INDEX:
            self.cache[id]['y'] = self.cache[id]['y'][1:self.SMOOTH_INDEX]
        self.cache[id]['y'].append(data['y'])

        lenz = len(self.cache[id]['z'])
        if lenz == self.SMOOTH_INDEX:
            self.cache[id]['z'] = self.cache[id]['z'][1:self.SMOOTH_INDEX]
        self.cache[id]['z'].append(data['z'])



    def read_f(self, ser):
        i = 0
        while i < 8:
            ch = ser.read()
            if ord(ch) == 0xFF:
                i += 1
                if i == 8:
                    break
            else:
                i = 0

    def read_num(self, ser):
        i = 0
        num = ''
        while i < 8:
            ch = ser.read()
            ch = ord(ch)
            num += chr(ch)
            # print(ch, ' ')
            i += 1
        return num

    def read_coords(self):
        data = []
        begin_symbols_count = 0

        while len(data) < self.DATA_SIZE:
            sym = ord(self.ser.read())

            if begin_symbols_count < self.MSG_BEGIN_SIZE:
                if sym == self.BEGIN_SYMBOL:
                    begin_symbols_count += 1
                else:
                    begin_symbols_count = 0
            else:
                data.append(sym)

        return data

    def transform(self, num):
        id = (num[0])
        x = ((num[1]) << 8) | (num[2])
        y = ((num[3]) << 8) | (num[4])
        z = ((num[5]) << 8) | (num[6])
        hsh = num[7]

        return id, x, y, z, hsh

    def test2(self):
        ser = serial.Serial('COM4')
        i = 0
        flag = False
        while i < 8:
            symbol = ser.read()
            if ord(symbol) == 0xff:
                i += 1
            else:
                i = 0
            if i == 8:
                symbols = []
                j = 0
                while j < 8:
                    symbol = ser.read()
                    if ord(symbol) != 0xff:
                        symbols.append(ord(symbol))
                        j += 1
                        if j == 8:
                            return symbols
                    else:
                        j = 0
                        i = 0
                        symbols = []
                        break

    def transform(self, num):
        # id = (num[0])
        id = bitstring.Bits(uint=num[0], length=16)
        # x = ((num[1]) << 8) | (num[2])
        x = bitstring.Bits(uint=((num[2]) << 8) | (num[1]), length=16)
        # y = ((num[3]) << 8) | (num[4])
        y = bitstring.Bits(uint=((num[4]) << 8) | (num[3]), length=16)
        # z = ((num[5]) << 8) | (num[6])
        z = bitstring.Bits(uint=((num[6]) << 8) | (num[5]), length=16)
        # hsh =num[7]
        hsh = 0x0
        return id.unpack('int')[0], x.unpack('int')[0], y.unpack('int')[0], z.unpack('int')[0], hsh

    def read(self):
        symbols = self.read_coords()
        if len(symbols):
            id, x, y, z, hsh = self.transform(symbols)

        rd = {'id': id - 1, 'x': x, 'y': y, 'z': z}

        return rd

    def close(self):
        self.ser.close()



# analyser = Analyser('references.json', 4)
# analyser.data_listen()

#analyser = Analyser('references.json')
# rdr = Reader('COM4')
# while True:
#     print(rdr.process_read())
