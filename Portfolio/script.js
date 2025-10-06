// script.js

// ----------------------------------------------------
// ส่วนที่ 1: การสร้าง URL Parameter (สำหรับใช้ใน index.html)
// ----------------------------------------------------

/**
 * ฟังก์ชันนี้สร้าง URL ที่มี parameter projectID และนำผู้ใช้ไปยัง project.html
 * @param {string} projectID - ID เฉพาะของโครงการ (เช่น 'web_lib', 'mobile_app')
 */
function goToProjectDetail(projectID) {
    // สร้าง URLSearchParams object เพื่อจัดการ parameters
    const params = new URLSearchParams();
    params.append('id', projectID); // เพิ่ม parameter ชื่อ 'id' และค่าเป็น projectID

    // นำทางไปยัง project.html พร้อม parameters
    window.location.href = 'project.html?' + params.toString();
}


// ----------------------------------------------------
// ส่วนที่ 2: การอ่าน URL Parameter (สำหรับใช้ใน project.html)
// ----------------------------------------------------

/**
 * ฟังก์ชันนี้อ่าน URL parameter และแสดงเนื้อหาโครงการที่เกี่ยวข้อง
 */
function displayProjectDetail() {
    // ดึงค่า parameter จาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');

    const contentArea = document.getElementById('project-content-area');

    if (!contentArea) {
        // กรณีที่ไม่สามารถหาพื้นที่แสดงผลได้
        console.error("Project content area not found!");
        return;
    }

    if (projectID) {
        // หากมี projectID ใน URL ให้แสดงรายละเอียดเฉพาะของ Project นั้น
        
        let projectData = {};

        // ฐานข้อมูล 'สมมติ' ของโครงการ
        switch (projectID) {
            case 'web_lib':
                projectData = {
                    title: "เว็บไซต์จัดการห้องสมุด 📚",
                    summary: "โครงการนี้พัฒนาขึ้นโดยใช้ PHP และ MySQL เพื่อฝึกการจัดการฐานข้อมูล CRUD สำหรับข้อมูลหนังสือและสมาชิก",
                    tech: "HTML, CSS, JavaScript, PHP, MySQL",
                    detail: "เป็นระบบที่ช่วยให้เจ้าหน้าที่สามารถเพิ่ม, ลบ, แก้ไขข้อมูลหนังสือ และติดตามสถานะการยืม-คืนของสมาชิกได้อย่างมีประสิทธิภาพ"
                };
                break;
            case 'mobile_app':
                projectData = {
                    title: "แอปพลิเคชันวางแผนการเรียนรู้ 📱",
                    summary: "เป็นแนวคิดในการสร้างแอปฯ มือถือเพื่อช่วยนักเรียนในการจัดตารางเรียน ติดตามความคืบหน้า และตั้งเป้าหมายการเรียนรู้รายวัน",
                    tech: "React Native, Node.js, MongoDB",
                    detail: "แอปฯ จะมีการแจ้งเตือน (Push Notifications) และแสดงแดชบอร์ดความคืบหน้าแบบกราฟิกเพื่อสร้างแรงจูงใจในการเรียน"
                };
                break;
            default:
                projectData = {
                    title: "ไม่พบข้อมูลโครงการ",
                    summary: "กรุณาเลือกโครงการจากหน้า Portfolio หลัก",
                    tech: "N/A",
                    detail: "ID โครงการไม่ถูกต้อง หรือไม่มีการระบุโครงการ"
                };
        }

        // แสดงผลลัพธ์ลงใน HTML
        contentArea.innerHTML = `
            <div class="project-card detailed">
                <h2>${projectData.title}</h2>
                <p class="project-summary">${projectData.summary}</p>
                <p><strong>เทคโนโลยีหลัก:</strong> ${projectData.tech}</p>
                <div class="project-detail-text">
                    <h3>รายละเอียดเพิ่มเติม:</h3>
                    <p>${projectData.detail}</p>
                </div>
                <a href="index.html" class="button back-button">← กลับสู่หน้าหลัก</a>
            </div>
        `;

    } else {
        // กรณีที่ไม่มี projectID ใน URL (เข้าหน้า project.html โดยตรง)
        contentArea.innerHTML = `
            <div class="project-card">
                <h2>ยินดีต้อนรับสู่หน้าโครงการ</h2>
                <p>กรุณาเลือกดูรายละเอียดโครงการจากหน้า Portfolio หลักเพื่อดูข้อมูลเฉพาะ</p>
            </div>
        `;
    }
}