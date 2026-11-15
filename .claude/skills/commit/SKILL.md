---
name: commit
description: Gợi ý lệnh git add chọn lọc, thông điệp commit chuẩn Conventional Commits và quy trình an toàn của dự án. Dùng khi người dùng gõ /commit hoặc hỏi cách commit code vừa làm.
---

# Commit Skill

Mục tiêu: giúp người dùng tự commit đúng file, đúng chuẩn, an toàn và nhanh gọn.

> **QUY TẮC BẤT DI BẤT DỊCH:** AI TUYỆT ĐỐI KHÔNG tự chạy lệnh `git commit`, `git push`, hoặc mở PR. Chỉ đưa lệnh rõ ràng để người dùng tự copy-paste vào terminal. Không thêm `Co-Authored-By` hay bất kỳ thông tin nào nhắc đến AI.

## Các bước thực hiện:

1. **Rà soát trạng thái git:**
   - Chạy `git status` và `git diff --stat` để kiểm tra các file đang sửa (`modified`) hoặc chưa theo dõi (`untracked`).
   - Phân biệt rõ:
     - File thuộc bước vừa làm (cần add).
     - File tuyệt đối **KHÔNG ĐƯỢC ADD**: `data/`, `.env`, tài liệu cá nhân (`.pptx`, `.pdf`, `.png` tạm), hoặc các file của bước khác chưa hoàn thành.

2. **Soạn thông điệp commit theo chuẩn Conventional Commits:**
   - Cấu trúc: `<type>(<scope>): <mô tả ngắn bằng tiếng Anh>`
   - **Type:**
     - `feat`: thêm tính năng mới cho người dùng.
     - `fix`: sửa lỗi, bug.
     - `docs`: sửa hoặc thêm tài liệu (README, journal, design...).
     - `refactor`: cơ cấu lại code nhưng không đổi hành vi/API.
     - `test`: thêm hoặc sửa bài test.
     - `style`: format code, chỉnh css/token.
   - **Scope:** `web`, `backend`, `core`, `eval`, `progress`, `coach`, `auth`, v.v.
   - **Mô tả:**
     - Ngắn gọn (< 72 ký tự), viết bằng tiếng Anh như quy ước chung của repo.
     - Dùng thể mệnh lệnh hiện tại (`add`, `fix`, `update`, không dùng `added`, `fixing`).
     - Viết chữ thường sau dấu hai chấm, không có dấu chấm ở cuối câu.

3. **Xuất lệnh cụ thể cho người dùng:**
   - Liệt kê lệnh `git add` chỉ đích danh từng file (hạn chế tối đa dùng `git add .` để tránh add nhầm rác).
   - Đưa lệnh `git commit -m "..."`.
   - Nếu đang ở nhánh tính năng, đưa thêm lệnh `git push -u origin <tên-nhánh>` và nhắc nhở mở PR trên tổ chức `Nha-Cong-Dong`.

