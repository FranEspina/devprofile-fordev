describe('Prueba sobre el Backend', () => {
  it('La API debe contestar a una llamada de prueba', () => {
    cy.request('http://localhost:3000/test/ping')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq('pong');
      });
  });
});
