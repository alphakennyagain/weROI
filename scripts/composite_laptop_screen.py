import subprocess
import sys

try:
    import cv2
    import numpy as np
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "opencv-python-headless", "-q"])
    import cv2
    import numpy as np

desk_path = r"C:\Users\EverybodyHatesA1one\Documents\WEROI\frontend\public\gbp\07-desk-candid-optional.png"
site_path = r"C:\Users\EverybodyHatesA1one\.cursor\projects\c-Users-EverybodyHatesA1one-Documents-WEROI\assets\c__Users_EverybodyHatesA1one_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-c7ec0b1f-c0e7-404f-8061-83286d578280.png"
out_path = r"C:\Users\EverybodyHatesA1one\Documents\WEROI\frontend\public\gbp\08-desk-weroi-homepage.png"

desk = cv2.imread(desk_path)
site = cv2.imread(site_path)
h, w = desk.shape[:2]
sh, sw = site.shape[:2]

# Tighter quad aligned to MacBook LCD only (1536x1024)
dst = np.float32([
    [562, 248],
    [822, 255],
    [808, 492],
    [578, 486],
])
src = np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]])
M = cv2.getPerspectiveTransform(src, dst)
warped = cv2.warpPerspective(site, M, (w, h))

mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillConvexPoly(mask, dst.astype(np.int32), 255)
mask_blur = cv2.GaussianBlur(mask, (5, 5), 0)
mask_f = mask_blur.astype(np.float32) / 255.0
mask_3 = cv2.merge([mask_f, mask_f, mask_f])

result = desk.astype(np.float32) * (1 - mask_3) + warped.astype(np.float32) * mask_3
result = np.clip(result, 0, 255).astype(np.uint8)

cv2.imwrite(out_path, result)
print(f"saved {out_path}")
