
import os
import sys
import cv2

print(sys.argv[1])
folder = sys.argv[1]
files = os.listdir(folder)
print(files)
images = []
for f in files:
   print("f")
   images.append(cv2.imread(folder + "/" + f))
   print(images[-1])
   
   cv2.imshow("k", images[-1])
   cv2.waitKey(100000)
