export const formatDate = (dateString) => {
    const date = new Date(dateString);

    // ตรวจสอบวันที่ที่ถูกต้อง
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    // ใช้ `toLocaleDateString` เพื่อแสดงวันที่ในรูปแบบที่เป็นมิตร
    return date.toLocaleDateString('th-TH', { // การแสดงผลวันที่ในรูปแบบไทย
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
