import json

class Analyser:
    orientations = ['x', 'y', 'z']
    # Consts
    INCORRECT_DIRECTION = 1
    MAX_TRANSITION_LENGTH_EXCEEDED = 2
    MAX_INDEXES_DELTA_EXCEEDED = 3

    MAX_TRANSITION_LENGTH = 3
    MAX_INDEXES_DELTA = 5

    def __init__(self, file_name):
        data = json.load(open(file_name))

        # Массивы с эталонами координат
        self.references = data['references']
        print (data)

    def data_listen(self):
        self.init_indexes()

        while True:
            data = self.read()
            self.step(data)


    def read(self):
        pass

    def step(self, data):
        id = data['id']

        for orientation in self.orientations:
            self.change_index(id, orientation, data[orientation])
            if not self.check_indexes():
                self.error(self.MAX_INDEXES_DELTA_EXCEEDED)

    def change_index(self, id, orientation, val):
        ind = self.indexes[id][orientation]
        ref = self.references[id][orientation]

        # Если дошли до последнего элемента, прекращаем обработку
        if ind == len(ref):
            return

        if abs(ref[ind + 1] - val) >= abs(ref[ind] - val):
            new_ind = ind + 1
        else:
            new_ind = ind

        while new_ind < len(ref) and abs(ref[new_ind + 1] - val) >= abs(ref[new_ind] - val):
            new_ind += 1

        if new_ind == ind + 1:
            return

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

    def init_indexes(self):
        # Указатели на текущий элемент в эталоне
        self.indexes = []
        for i in range(len(self.orientations)):
            index = {}
            for orientation in self.orientation:
                index[orientation] = 0

            self.indexes.append(index)

    def check_indexes(self):
        min_ind = len(self.orientations[0]['x'])
        max_ind = 0

        for obj in self.indexes:
            for ind in obj:
                min_ind = min(min_ind, ind)
                max_ind = min(max_ind, ind)

        return max_ind - min_ind < self.MAX_INDEXES_DELTA

    def error(self, err):
        pass


analyser = Analyser('references.json')