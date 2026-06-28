from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"C:\Users\EverybodyHatesA1one\Documents\WEROI\portfolio\public\case-studies"
W, H = 1200, 675

def lerp(a,b,t):
    return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))

def grid(draw, color, step=48):
    r,g,b = color
    for x in range(0, W, step):
        draw.line([(x,0),(x,H)], fill=(r,g,b,22))
    for y in range(0, H, step):
        draw.line([(0,y),(W,y)], fill=(r,g,b,22))

def font(size, bold=False):
    windir = os.environ.get("WINDIR", r"C:\Windows")
    names = (["segoeuib.ttf","arialbd.ttf"] if bold else ["segoeui.ttf","arial.ttf"])
    for n in names:
        p = os.path.join(windir, "Fonts", n)
        if os.path.exists(p):
            try: return ImageFont.truetype(p, size)
            except: pass
    return ImageFont.load_default()

def mono(size):
    p = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", "consola.ttf")
    if os.path.exists(p):
        try: return ImageFont.truetype(p, size)
        except: pass
    return ImageFont.load_default()

COVERS = [
    ("studysync-cover.png","StudySync API","Python · FastAPI · SQL · JWT",(12,10,26),(21,18,56),(49,46,129),(99,102,241),(30,27,75),"REST","GET /api/v1/deadlines"),
    ("webhook-relay-cover.png","Webhook Relay","Python · HMAC · JSON · REST",(8,18,22),(12,40,48),(6,78,59),(16,185,129),(15,45,52),"WEBHOOKS","POST /deliver signed"),
    ("openapi-devkit-cover.png","OpenAPI DevKit","TypeScript · Node · Zod · CLI",(10,12,28),(22,28,62),(30,58,138),(56,189,248),(20,32,72),"CODEGEN","npx openapi-devkit"),
    ("phone-store-cover.png","Phone Store API","TypeScript · Express · MongoDB",(18,10,24),(45,18,52),(88,28,135),(236,72,153),(55,20,65),"API","POST /cart/checkout"),
    ("ds-bst-lab-cover.png","BST Lab","Java · JUnit · algorithms",(12,14,18),(28,32,40),(52,70,92),(245,158,11),(35,42,55),"JAVA","insert delete traverse"),
    ("db-library-cover.png","Library DB","SQL · PostgreSQL · Python",(8,16,24),(14,42,58),(12,74,110),(14,165,233),(18,50,72),"SQL","SELECT loans FROM books"),
    ("prog-fund-algorithms-cover.png","Algorithms","Python · benchmarking",(14,10,20),(40,22,55),(76,29,149),(168,85,247),(48,28,72),"PERF","merge vs quicksort"),
    ("cyber-network-cover.png","Network Hardening","Linux · policy · networking",(6,12,10),(12,32,22),(8,52,38),(34,197,94),(16,40,28),"SEC","firewall patch LAN"),
    ("portfolio-cover.png","Zachary Hutton Portfolio","Next.js · TypeScript · Tailwind · Motion",(12,10,26),(21,18,56),(49,46,129),(99,102,241),(30,27,75),"LIVE","zachary-hutton.vercel.app"),
]

tf, sf, bf, cf = font(50,True), font(22), font(14,True), mono(18)
for file,title,sub,c1,c2,c3,ac,pan,badge,code in COVERS:
    img = Image.new("RGB",(W,H)); draw = ImageDraw.Draw(img,"RGBA")
    for y in range(H):
        t=y/(H-1); col = lerp(c1,c2,t/0.55) if t<0.55 else lerp(c2,c3,(t-0.55)/0.45)
        draw.line([(0,y),(W,y)], fill=col)
    grid(draw, ac)
    draw.rounded_rectangle([64,88,784,508], radius=20, fill=pan, outline=ac, width=2)
    draw.text((100,130), code, fill=(199,210,254), font=cf)
    draw.rounded_rectangle([W-280,H-130,W-80,H-94], radius=8, fill=ac)
    tw=draw.textlength(badge, font=bf); draw.text((W-280+(200-tw)/2,H-122), badge, fill=(255,255,255), font=bf)
    draw.text((W-360,160), title, fill=(253,253,253), font=tf)
    draw.text((W-360,230), sub, fill=ac, font=sf)
    draw.rectangle([0,H-6,W,H], fill=ac)
    p=os.path.join(OUT,file); img.save(p,"PNG",optimize=True); print(p, os.path.getsize(p))
