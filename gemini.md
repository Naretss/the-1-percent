

```markdown
# Gemini Development Guidelines & Feature Specs
**Project:** [The 1% App](https://www.the-1-percent.app/)
**Description:** เอกสารรวบรวมฟีเจอร์ แนวทางการพัฒนา และ System Instructions 

---

## 📌 System Instruction: การบันทึกประวัติการพัฒนา (`history.md`)
**คำสั่งสำหรับ AI และทีมนักพัฒนา:** ทุกครั้งที่มีการเขียนโค้ดเพิ่ม แก้ไขบั๊ก หรือออกแบบฟีเจอร์ใหม่ในโปรเจกต์นี้ ให้ทำการบันทึกการเปลี่ยนแปลงลงในไฟล์ `history.md` เสมอ เพื่อให้ง่ายต่อการติดตามความคืบหน้า (Version Control) และให้ AI สามารถอ่านบริบทเพื่อกลับมาพัฒนาต่อได้อย่างไร้รอยต่อ

**รูปแบบการบันทึกใน `history.md` (Template):**
```markdown
### [YYYY-MM-DD] - [ชื่อฟีเจอร์ หรือ หัวข้อการอัปเดต]
- **Added/Modified:** [อธิบายสั้นๆ ว่าทำอะไรไปบ้าง เช่น เพิ่มปุ่ม Toggle ลดรายจ่าย, เพิ่ม Logic คำนวณดอกเบี้ย]
- **Note:** [ข้อสังเกต ปัญหาที่พบ หรือตัวแปรที่ต้องระวัง]
- **Next Step:** [สิ่งที่จะทำต่อไปในแผนงาน]

```

---
# เพิ่ม funtions
# UI/UX Specification: เส้นทางสู่เงินล้านแรก (The First Million Roadmap)

## 1. Card Menu (หน้า Dashboard)
* **Icon:** 🚀 (Rocket) หรือ 🏔️ (Mountain Flag)
* **Title:** เส้นทางสู่เงินล้านแรก
* **Subtitle:** วางแผนลงทุนรายเดือน (DCA) เพื่อพิชิต 1,000,000 บาทแรกของคุณ
* **Button:** เริ่มต้นสร้างเส้นทาง

## 2. Inner Page Layout
**Section 1: Input (Interactive Sliders & Buttons)**
* [Slider] เงินออมรายเดือน: 1,000 - 50,000 บาท (Default: 5,000)
* [Radio Buttons] เลือกสไตล์การลงทุน:
   - [ ] เงินฝาก/สลาก (~2%/ปี)
   - [x] กองทุนรวมผสม (~5%/ปี)  <-- Default
   - [ ] หุ้น/กองทุนดัชนี (~8%/ปี)

**Section 2: Result Display (Hero Text)**
* "เป้าหมาย 1,000,000 บาทของคุณ จะสำเร็จในอีก..."
* **[ 12 ปี 9 เดือน ]** *(ตัวเลขใหญ่ สีเหลืองทอง #FBBF24)*

**Section 3: Visualization (Area Chart)**
* กราฟแกน X = จำนวนปี, แกน Y = จำนวนเงิน (0 ถึง 1,000,000)
* พื้นที่สีเทาเข้ม = เงินต้นสะสม
* พื้นที่สีเหลืองทอง/เขียว = ดอกเบี้ยทบต้น (Compound Interest)

**Section 4: Actionable Tip (Info Box)**
* Dynamic Text เปลี่ยนตามสไตล์การลงทุนที่เลือก (เช่น แนะนำประเภทสินทรัพย์ที่ให้ผลตอบแทน 5%)

**Section 5: unitest automate**
* เพิ่ม unitest ไปด้วย