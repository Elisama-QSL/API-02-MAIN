const  request  = require('supertest');
const { expect } = require('chai');

describe('Testes de Transferência', () => {
    it('Validar que é possível transferur grana entre duas contas', async () => {
        const resposta = await request('http://localhost:4000/graphql')
            .post('')
            .send({
                query: `
                    mutation LoginUser($username: String!, $password: String!) {
                        loginUser(username: $username, password: $password){
                            token
                        }
                    }`,
                variables: {
                    username: 'julio',
                    password: '123456'
                }
            });
         //console.log(resposta.body.data.loginUser.token);
         
         const respostaTransferencia = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${resposta.body.data.loginUser.token}`)
            .send({
                query: `
                    mutation CreateTransfer($from: String!, $to: $to, $value: Float!) {
                        createTransfer(from: $from, to: $to, value: $value) {
                            date
                            from
                            to
                            value
                        }
                    }                      
                `,
                variables: {
                    from: 'julo',
                    to: 'priscila',
                    value: 15
                }
            });

        expect(respostaTransferencia.status).to.equal(400);



    });



     it('Saldo insuficiente', async () => {
        const resposta = await request('http://localhost:4000/graphql')
            .post('')
            .send({
                query: `
                    mutation LoginUser($username: String!, $password: String!) {
                        loginUser(username: $username, password: $password){
                            token
                        }
                    }`,
                variables: {
                    username: 'julio',
                    password: '123456'
                }
            });
         //console.log(resposta.body.data.loginUser.token);
         
         const respostaTransferencia = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${resposta.body.data.loginUser.token}`)
            .send({
                query: `
                    mutation CreateTransfer($from: String!, $to: String!, $value: Float!) {
                        createTransfer(from: $from, to: $to, value: $value) {
                            date
                            from
                            to
                            value
                        }
                    }                      
                `,
                variables: {
                    from: 'julo',
                    to: 'priscila',
                    value: 10000.01
                }
            });

        expect(respostaTransferencia.status).to.equal(200);
        expect(respostaTransferencia.body.errors[0].message).to.equal('Saldo insuficiente para realizar a transferência');



    });
});