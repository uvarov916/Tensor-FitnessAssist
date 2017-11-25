import keyboard
import json
from analyser import Reader
import os


class ReferenceGenerator:
    ORIENTATIONS = ['x', 'y', 'z']
    MIN_VAL = -16000
    MAX_VAL = 16000
    MAX_CONST_ERROR = 500

    def __init__(self, sensor_count):
        self.ref = []
        self.sensor_count = sensor_count
        for i in range(sensor_count):
            obj = {}
            for orientation in self.ORIENTATIONS:
                obj[orientation] = {
                    'is_const': False,
                    'values': [],
                    'min': self.MIN_VAL,
                    'max': self.MAX_VAL
                }
            self.ref.append(obj)

        self.reader = Reader('COM9')

    def make_ref(self):
        print ('Start')
        clear = lambda: os.system('cls')
        while True:
            try:
                if keyboard.is_pressed('enter'):  # if key 'q' is pressed
                    break  # finishing the loop
            except:
                pass

            data = self.reader.read()

            print (data)

            clear()

            self.write_data(data)

        for i in range(self.sensor_count):
            for orientation in self.ORIENTATIONS:
                self.detect_const(i, orientation)

        json.dump({'references': list(self.ref)}, open('references.json', 'w'))

        self.reader.close()

        print('Stop')

    def write_data(self, data):
        id = data['id'] - 1

        for orientation in self.ORIENTATIONS:
            self.ref[id][orientation]['values'].append(data[orientation])

    def detect_const(self, id, orientation):
        min_val = self.MAX_VAL
        max_val = self.MIN_VAL

        for val in self.ref[id][orientation]['values']:
            min_val = min(min_val, val)
            max_val = max(max_val, val)

        if (max_val - min_val <= self.MAX_CONST_ERROR):
            self.ref[id][orientation]['is_const'] = True

        self.ref[id][orientation]['min'] = min_val
        self.ref[id][orientation]['max'] = max_val



generator = ReferenceGenerator(4)
generator.make_ref()
