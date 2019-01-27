
import os
import sys
import cv2
import numpy as np

folder = sys.argv[1]
print(folder)

files = os.listdir(folder)
files.sort()
print(files)
images = []
for f in files:
   if folder == "CRAWL-under-DESK/" :
       images.append(cv2.imread(folder + "/" + f, cv2.IMREAD_UNCHANGED))
        
       images[-1] = images[-1][:, 55:-55][77:-43]
       print(images[-1].shape)
       
       images[-1] = cv2.resize(images[-1], (64, 128))
       cv2.imshow("k", images[-1])
       print(images[-1].shape)
       cv2.waitKey(30)
       
   break
   if(folder != "hide-wardrobe-anim"):
       #print(f)
       images.append(cv2.imread(folder + "/" + f, cv2.IMREAD_UNCHANGED))
        
       images[-1] = images[-1][:, 55:-55][77:-43]
       print(images[-1].shape)
       
       images[-1] = cv2.resize(images[-1], (64, 128))
       #cv2.imshow("k", images[-1])
       #print(images[-1].shape)
       cv2.waitKey(30)
   else:
       images.append(cv2.imread(folder + "/" + f, cv2.IMREAD_UNCHANGED))
        
       images[-1] = images[-1][:, :-55][77:-43]
       images[-1] = np.concatenate([np.zeros((180, 180 - 145, 4), dtype=images[-1].dtype), images[-1]], 1)
       print(images[-1].shape)
       images[-1] = cv2.resize(images[-1], (128, 128))
       cv2.imshow("k", images[-1])
       print(images[-1].shape)
       cv2.waitKey(80)
x = np.concatenate(images, axis=1)
cv2.imshow("k", x)
cv2.waitKey(343)
cv2.imwrite(folder[:-2] + "sheet.png", x)
print(x.shape)
