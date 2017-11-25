import keyboard
import json
from analyser import Reader
import os
import matplotlib.pyplot as plt


class ReferenceGenerator:
    ORIENTATIONS = ['x', 'y', 'z']
    MIN_VAL = -32000
    MAX_VAL = 32000
    MAX_CONST_ERROR = 4000
    MIN_STEP = 2000

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

        self.reader = Reader('COM12')

        print ('Connected')

    def make_ref(self):
        f = input()
        print ('Start')

        for i in range(1000):
            self.reader.process_read()
        while True:
            try:
                if keyboard.is_pressed('enter'):
                    break
            except:
                pass

            data = self.reader.process_read()

            self.write_data(data)


        for i in range(self.sensor_count):
            for orientation in self.ORIENTATIONS:
                self.detect_const(i, orientation)

        json.dump({'references': list(self.ref)}, open('references.json', 'w'))

        self.reader.close()

        print('Stop')

        for i in range(self.sensor_count):
            fig, axes = plt.subplots(2, 2)
            axes[0][0].plot(self.ref[i]['x']['values'])
            axes[0][1].plot(self.ref[i]['y']['values'])
            axes[1][0].plot(self.ref[i]['z']['values'])
            plt.show()



    def write_data(self, data):
        id = data['id']

        for orientation in self.ORIENTATIONS:
            val = data[orientation]
            values = self.ref[id][orientation]['values']
            if not len(values) or abs(values[len(values) - 1] - val) > self.MIN_STEP:
                self.ref[id][orientation]['values'].append(val)

    def detect_const(self, id, orientation):
        min_val = self.MAX_VAL
        max_val = self.MIN_VAL

        for val in self.ref[id][orientation]['values']:
            min_val = min(min_val, val)
            max_val = max(max_val, val)

        if (max_val - min_val <= self.MAX_CONST_ERROR):
            self.ref[id][orientation]['is_const'] = True

        # self.ref[id][orientation]['min'] = min_val
        # self.ref[id][orientation]['max'] = max_val

        self.ref[id][orientation]['min'] = -32000
        self.ref[id][orientation]['max'] = 32000



generator = ReferenceGenerator(4)
generator.make_ref()
