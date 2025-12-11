/// <reference types="cypress" />

describe('Location Selection Page (STATIC - SIMPLIFIED)', () => {

    // Dữ liệu hardcode trong component (đã đồng bộ hóa)
    const DEFAULT_LOCATIONS = [
        'Helsinki Central', 
        'Oulu', 
        'Turku'
    ];

    // Đường dẫn gốc của ứng dụng
    const LOCATION_PAGE_PATH = '/'; 
    const HOME_PAGE_PATH = '/home'; 

    beforeEach(() => {
        cy.clearLocalStorage();
        // Không cần cy.intercept hay cy.wait
        // Tăng timeout cho cy.visit phòng trường hợp trang chủ (root '/') chậm
        cy.visit(LOCATION_PAGE_PATH, { timeout: 15000 }); 
    });

    // --- Bài kiểm tra 1: Rendering Cơ bản và Số lượng ---
    it('should successfully load the page and render the correct number of locations', () => {
        // Kiểm tra URL
        cy.url().should('include', LOCATION_PAGE_PATH);
        
        // Kiểm tra tiêu đề chính (tăng timeout để chống lại UI render chậm)
        cy.contains('Choose your location', { timeout: 10000 }).should('be.visible');

        // Xác nhận số lượng phần tử vị trí
        cy.get('.location-item').should('have.length', 3);

        // Kiểm tra vị trí đầu tiên để xác nhận nội dung đang được render
        cy.get(`[data-test="location-helsinki central"]`).should('be.visible').and('contain', 'Helsinki Central');
    });
    
    // --- Bài kiểm tra 2: Chức năng Click (Core Logic) ---

    it('should select a location and correctly navigate to the home page', () => {
        const selectedCity = 'Oulu';
        const selectedLocationSelector = `[data-test="location-${selectedCity.toLowerCase()}"]`;
        
        // 1. Click vào vị trí
        // Đảm bảo phần tử này đã được render (đã được kiểm tra trong test 1)
        cy.get(selectedLocationSelector).click();

        // 2. Xác nhận localStorage được thiết lập đúng
        cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedCity')).to.equal(selectedCity);
        });

        // 3. Xác nhận điều hướng tới trang Home
        cy.url().should('include', HOME_PAGE_PATH);
    });

    // --- Bài kiểm tra 3: Ghi đè Lựa chọn (Overwriting) ---
    
    it('should successfully overwrite selection and navigate', () => {
        const firstCity = 'Oulu';
        const secondCity = 'Helsinki Central';
        
        // 1. Chọn vị trí thứ nhất
        cy.get(`[data-test="location-${firstCity.toLowerCase()}"]`).click();
        
        // 2. Quay lại trang Location (CẦN THIẾT)
        // Đây là điểm dễ gây lỗi, nhưng cần thiết để kiểm tra ghi đè.
        cy.go('back'); 
        cy.url().should('include', LOCATION_PAGE_PATH);

        // 3. Chọn vị trí thứ hai
        cy.get(`[data-test="location-${secondCity.toLowerCase()}"]`).click();
        
        // 4. Xác nhận localStorage đã được cập nhật thành thành phố thứ hai
        cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedCity')).to.equal(secondCity);
        });
        
        // 5. Xác nhận đã điều hướng
        cy.url().should('include', HOME_PAGE_PATH);
    });
});