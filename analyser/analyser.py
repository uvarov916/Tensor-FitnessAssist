import serial
import codecs

class Analyser:
    def data_listen(self):
        while True:
            data = self.read()

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
            #print(ch, ' ')
            i += 1
        return num

    def test(self):
        ser = serial.Serial('COM4')
        i = 0
        k = -1
        symbols = []
        while True:
            symbol = ser.read()

            #print(symbol)
            if k == -1 and i < 8:
                if ord(symbol) == 0xff:
                    i += 1
                else:
                    k = 0
                    symbols.append(ord(symbol))
            else:
                k += 1
                symbols.append(ord(symbol))
                if k == 7:
                    # print(codecs.encode(symbols, 'hex'))
                    #print(symbols)
                    result = symbols
                    print(symbols)
                    symbols = []
                    return result


    def transform(self, num):
        id = (num[0])
        x = ((num[1]) << 8) | (num[2])
        y = ((num[3]) << 8) | (num[4])
        z = ((num[5]) << 8) | (num[6])
        hsh =num[7]

        return id, x, y, z, hsh

    def read(self):
        symbols = self.test()
        id, x, y, z, hsh = self.transform(symbols)

        rd = {'id': id, 'x': x, 'y': y, 'z': z}

        return rd


a = Analyser()

while True:
    (a.read())

