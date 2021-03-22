/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'
context('Dev Finances Agilizei', () => {
  beforeEach(() => {

    cy.visit('https://devfinance-agilizei.netlify.app', {
      onBeforeLoad: (win) => {
        prepareLocalStorage(win)
      }
    })


  });

  it('Cadastrar entradas', () => {
    
    cy.get('#transaction .button').click()            // id + class
    cy.get('#description').type('Mesada')             // id
    cy.get('[name=amount]').type(12)                   // attribute
    cy.get('[type=date]').type('2021-03-17')          // attribute
    cy.get('button').contains('Salvar').click()        // type and value
    cy.get('#data-table tbody tr').should('have.length', 3)

  });

  it('Cadastrar saídas', () => {
    
    cy.get('#transaction .button').click()            // id + class
    cy.get('#description').type('Mesada')             // id
    cy.get('[name=amount]').type(-12)                   // attribute
    cy.get('[type=date]').type('2021-03-17')          // attribute
    cy.get('button').contains('Salvar').click()        // type and value

    cy.get('#data-table tbody tr').should('have.length', 3)
  });

  it('Remover entradas e saídas', () => {

    //estratégia 1: voltar para o elemento pai e avançar para um td img attr

    cy.get('td.description').contains('Mesada')
    .contains("Mesada")
      .parent()
      .find('img[onclick*=remove]')
      .click()

    //estratégia 2: buscar todos os irmãos e buscar o que tem img + attr

    cy.get('td.description')
      .contains("Suco Kapo")
      .siblings()
      .children('img[onclick*=remove]')
      .click()

    cy.get('#data-table tbody tr').should('have.length', 0)
  });

  it('Validar saldo com diversas transações', () => {

    let incomes = 0
    let expenses = 0

    // capturar as linhas com as transações e as colunas com valores
    cy.get('#data-table tbody tr')
      .each(($el, index, $list) => {

        // capturar o texto das colunas
        cy.get($el).find('td.income, td.expense').invoke('text').then(text => {

          // formatar os valores das linhas
          if(text.includes('-')){
            expenses = expenses + format(text)
          } else {
            incomes = incomes + format(text)
          }

        })

      })

    // capturar o texto do total
    cy.get('#totalDisplay').invoke('text').then(text => {
      
      let formattedTotalDisplay = format(text)
      // somar os valores de entradas e de saidas
      let expectedTotal = incomes + expenses 

      // comparar  somatório de entradas e saídas com o total
      expect(formattedTotalDisplay).to.eq(expectedTotal)

    })  

  });
});