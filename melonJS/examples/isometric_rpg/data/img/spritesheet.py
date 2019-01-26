
import os
import sys
import cv2
import numpy as np


print(sys.argv[1])
folder = sys.argv[1]
files = os.listdir(folder)
files.sort()
print(files)
images = []
for f in files:
   print(f)
   images.append(cv2.imread(folder + "/" + f, cv2.IMREAD_UNCHANGED))
   
   
   cv2.imshow("k", images[-1])
   print(images[-1].shape)
   cv2.waitKey(30)
x = np.concatenate(images, axis=1)
cv2.imshow("k", x)
cv2.waitKey(343)
cv2.imwrite(folder[:-2] + "sheet.png", x)
print(x.shape)
