describe('Staff See Table - Edit & Delete Flow', () => {
  
  // ======================================================
  // 1. 动态生成 "今天" 的时间
  // ======================================================
  // 为什么要这样做？因为 SeeTable 页面只显示当前周的排期。
  // 如果我们写死 "2023-01-01"，你今天跑测试时，那个排期早就看不到了。
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // 获取 YYYY-MM-DD
  
  // 构造一个 ISO 时间字符串，模拟今天下午 14:00 的电影
  // 格式类似: "2025-12-11T14:00:00.000Z"
  const mockStartTime = `${dateStr}T14:00:00.000Z`; 

  beforeEach(() => {
    // 拦截主页获取电影院信息的请求 (防止主页报错)
    cy.intercept('GET', '**/api/staff/theaters/*', {
      statusCode: 200,
      body: { id: 1, name: 'Oulu Theater', rooms: [{ auditoriumNumber: 1, name: 'Room 1' }] }
    }).as('getTheater');

    // 拦截 "See Table" 页面获取排期的请求
    // 关键点：返回我们动态生成的 mockStartTime
    cy.intercept('GET', '**/api/staff/showtimes/*', {
      statusCode: 200,
      body: [
        {
          id: 999,
          movie_title: 'Test Movie For Edit',
          start_time: mockStartTime, 
          duration: 120, // 2小时
          // 下面这几个是你的后端计算出来的，我们简单 mock 一下
          end_time: `${dateStr}T16:00:00.000Z`,
          clean_end_time: `${dateStr}T16:30:00.000Z`
        }
      ]
    }).as('getShowtimes');

    // 拦截更新排期 (PUT)
    cy.intercept('PUT', '**/api/staff/showtimes/999', {
      statusCode: 200,
      body: { message: 'Update successful' }
    }).as('updateShowtime');

    // 拦截删除排期 (DELETE)
    cy.intercept('DELETE', '**/api/staff/showtimes/999', {
      statusCode: 200,
      body: { message: 'Delete successful' }
    }).as('deleteShowtime');
  });

  it('should navigate to See Table, edit a showtime, and save', () => {
    // 1. 访问主页 (注入 selectedCity 防止跳转)
    cy.visit('/StaffHomePage/1', {
      onBeforeLoad: (win) => { win.localStorage.setItem('selectedCity', 'Oulu') }
    });

    // 注意：这里不需要 wait('@getMovies')，因为主页不加载电影列表！
    // 只要等待主页的卡片出现即可
    cy.get('.roomCard', { timeout: 10000 }).should('exist');

    // 2. 点击 "See Table" 按钮
    // 使用 force: true 因为按钮在 hover 效果里
    cy.get('.roomCard').first().within(() => {
      cy.contains('button', 'See Table').click({ force: true });
    });

    // 3. 验证跳转并等待数据
    cy.url().should('include', '/StaffSeeTable');
    cy.wait('@getShowtimes'); // 这里才需要等数据

    // 4. 在表格里找到我们的 Mock 电影
    cy.contains('.movieTitleInfo', 'Test Movie For Edit').should('be.visible');

    // 5. 点击电影打开 Modal
    cy.contains('.movieTitleInfo', 'Test Movie For Edit').click();
    cy.get('.modal').should('be.visible');

    // 6. 修改时间
    // 你的代码里有两个 select class="timeSelect"
    // eq(0) 是小时, eq(1) 是分钟
    cy.get('.modal .timeSelect').eq(0).select('16'); // 改成 16 点
    cy.get('.modal .timeSelect').eq(1).select('30'); // 改成 30 分

    // 7. 点击 Save
    cy.contains('button', 'Save').click();

    // 8. 验证发出的请求是否正确
    cy.wait('@updateShowtime').then((interception) => {
      const body = interception.request.body;
      expect(body.time).to.equal(16);
      expect(body.minute).to.equal(30);
      expect(body.date).to.include(dateStr); // 日期应该是今天
    });

    // 9. 验证 Modal 关闭
    cy.get('.modal').should('not.exist');
  });

  it('should delete a showtime successfully', () => {
    // 快速进入流程
    cy.visit('/StaffHomePage/1', {
      onBeforeLoad: (win) => { win.localStorage.setItem('selectedCity', 'Oulu') }
    });
    
    // 进入 See Table
    cy.get('.roomCard').first().within(() => {
      cy.contains('button', 'See Table').click({ force: true });
    });
    cy.wait('@getShowtimes');

    // 打开 Modal
    cy.contains('.movieTitleInfo', 'Test Movie For Edit').click();

    // 点击 Delete
    cy.contains('button', 'Delete').click();

    // 验证 DELETE 请求
    cy.wait('@deleteShowtime').then((interception) => {
      expect(interception.request.url).to.include('/999');
    });

    // 验证 Modal 关闭
    cy.get('.modal').should('not.exist');
  });
});