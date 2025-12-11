describe('Location Selection Page (Static Data)', () => {

    // Dữ liệu hardcode trong component
    const DEFAULT_LOCATIONS = [
        'Helsinki Central', 'Oulu', 'Turku'
    ];

    const LOCATION_PAGE_PATH = '/';
    const HOME_PAGE_PATH = '/home'; 

    beforeEach(() => {
        cy.clearLocalStorage();
        // Không cần cy.intercept hay cy.wait
        cy.visit(LOCATION_PAGE_PATH);
    });

    // --- Tests for Rendering ---

    it('should load the page and render all default locations immediately', () => {
        cy.url().should('include', LOCATION_PAGE_PATH);
        cy.contains('Choose your location').should('be.visible');

        // Xác nhận số lượng phần tử vị trí đã được render
        cy.get('.location-item').should('have.length', 3);

        // Xác nhận nội dung của từng vị trí
        DEFAULT_LOCATIONS.forEach(city => {
            cy.get(`[data-test="location-${city.toLowerCase()}"]`)
              .should('be.visible')
              .and('contain', city);
        });
    });
    
    // --- Test for Click Functionality and Navigation ---

    it('should select a location, set localStorage, and navigate to the home page', () => {
        const selectedCity = 'Oulu';
        const selectedLocationSelector = `[data-test="location-${selectedCity.toLowerCase()}"]`;
        
        // 1. Click vào vị trí mong muốn
        cy.get(selectedLocationSelector).click();

        // 3. Xác nhận localStorage được thiết lập đúng
        cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedCity')).to.equal(selectedCity);
        });

        // 4. Xác nhận điều hướng tới trang Home
        cy.url().should('include', HOME_PAGE_PATH);
    });

    it('should overwrite selection if a new location is clicked', () => {
        const firstCity = 'Oulu';
        const secondCity = 'Helsinki Central';

        // 1. Chọn vị trí thứ nhất
        cy.get(`[data-test="location-${firstCity.toLowerCase()}"]`).click();
        
        // Quay lại trang Location (Cần thiết nếu navigate('/home') được gọi)
        // Lưu ý: Nếu component tự động navigate, bạn sẽ cần phải quay lại trang này:
        cy.go('back'); 
        cy.url().should('include', LOCATION_PAGE_PATH);

        // 2. Chọn vị trí thứ hai
        cy.get(`[data-test="location-${secondCity.toLowerCase()}"]`).click();
        
        // 3. Xác nhận localStorage đã được cập nhật
        cy.window().then((win) => {
            expect(win.localStorage.getItem('selectedCity')).to.equal(secondCity);
        });
        
        // 4. Xác nhận đã điều hướng
        cy.url().should('include', HOME_PAGE_PATH);
    });
});