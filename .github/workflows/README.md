# GitHub Actions Workflows

## Các workflow đã cấu hình:

### 1. `cypress.yml` - Full CI/CD Pipeline
Workflow này chạy khi:
- Push code lên `main`, `master`, hoặc `develop` branch
- Tạo Pull Request vào các branch trên

**Chú ý:** Cần cấu hình backend server để tests hoạt động đúng.

### 2. `cypress-simple.yml` - Simplified Pipeline
Workflow đơn giản hơn, chỉ test frontend:
- Chạy khi push hoặc PR vào `main`/`master`
- Build và preview app
- Chạy Cypress tests

**Khuyến nghị:** Dùng workflow này nếu chưa có backend hoặc test môi trường.

### 3. `cypress-manual.yml` - Manual Trigger
Workflow chạy thủ công:
- Vào tab "Actions" trên GitHub
- Chọn "Cypress Tests (Manual Trigger)"
- Click "Run workflow"
- Chọn browser và chạy

## Cách sử dụng:

### Bật workflow:
1. Push code lên GitHub
2. Vào tab "Actions" trên repository
3. Workflow sẽ tự động chạy

### Xem kết quả:
- ✅ Màu xanh = Tests pass
- ❌ Màu đỏ = Tests fail
- Click vào workflow để xem chi tiết
- Download screenshots/videos nếu test fail

## Lưu ý:

### Nếu tests cần database:
Bạn cần:
1. Setup test database trên cloud (neon.tech, supabase, etc.)
2. Thêm database credentials vào GitHub Secrets:
   - Vào Settings > Secrets and variables > Actions
   - Thêm: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
3. Cập nhật workflow để sử dụng secrets

### Nếu chỉ test UI (không cần BE):
Dùng `cypress-simple.yml` - workflow này đã được tối ưu cho UI tests only.

## Disable workflows:

Nếu không muốn tự động chạy tests:
1. Xóa hoặc đổi tên các file `.yml` trong folder này
2. Hoặc comment lại phần `on:` trong workflow file
