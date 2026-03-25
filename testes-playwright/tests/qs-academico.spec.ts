import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://mak-tome07.github.io/02-TesteAutomatizado/');
    await expect(page.locator('#nome')).toBeVisible();
  });

  // ========== VALIDAÇÕES BÁSICAS DA INTERFACE ==========

  test.describe('Validações básicas da interface', () => {

    test('deve carregar corretamente a interface', async ({ page }) => {
      await expect(page).toHaveTitle(/QS Acadêmico/);

      await expect(page.locator('#secao-cadastro')).toBeVisible();

      await expect(page.locator('#nome'))
        .toHaveAttribute('placeholder', 'Digite o nome completo');

      await expect(page.getByText('Nenhum aluno cadastrado.'))
        .toBeVisible();
    });

  });

  // ========== CADASTRO DE ALUNOS ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.locator('#nome').fill('João Silva');
      await page.locator('#nota1').fill('7');
      await page.locator('#nota2').fill('8');
      await page.locator('#nota3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const linhas = page.locator('#tabela-alunos tbody tr');

      await expect(linhas).toHaveCount(1);
      await expect(page.locator('#tabela-alunos tbody'))
        .toContainText('João Silva');
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.locator('#nome').fill('Ana Costa');
      await page.locator('#nota1').fill('9');
      await page.locator('#nota2').fill('8');
      await page.locator('#nota3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem'))
        .toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.locator('#nota1').fill('7');
      await page.locator('#nota2').fill('8');
      await page.locator('#nota3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.getByText('Nenhum aluno cadastrado.'))
        .toBeVisible();
    });

    test('deve cadastrar múltiplos alunos', async ({ page }) => {
      const alunos = [
        { nome: 'A', n1: '7', n2: '7', n3: '7' },
        { nome: 'B', n1: '8', n2: '8', n3: '8' },
        { nome: 'C', n1: '9', n2: '9', n3: '9' },
      ];

      for (const aluno of alunos) {
        await page.locator('#nome').fill(aluno.nome);
        await page.locator('#nota1').fill(aluno.n1);
        await page.locator('#nota2').fill(aluno.n2);
        await page.locator('#nota3').fill(aluno.n3);
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr'))
        .toHaveCount(3);
    });

  });

  // ========== CÁLCULO DE MÉDIA ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média corretamente', async ({ page }) => {
      await page.locator('#nome').fill('Pedro Santos');
      await page.locator('#nota1').fill('8');
      await page.locator('#nota2').fill('6');
      await page.locator('#nota3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const celulaMedia = page
        .locator('#tabela-alunos tbody tr')
        .first()
        .locator('td')
        .nth(4);

      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  // ========== EXCLUSÃO E DIÁLOGO ==========

  test.describe('Exclusão de alunos', () => {

    test('deve excluir um aluno', async ({ page }) => {
      await page.locator('#nome').fill('João Silva');
      await page.locator('#nota1').fill('7');
      await page.locator('#nota2').fill('7');
      await page.locator('#nota3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      await page.getByRole('button', { name: /Excluir/ }).click();

      await expect(page.locator('#tabela-alunos tbody'))
        .not.toContainText('João Silva');
    });

  });

  // ========== ESTATÍSTICAS ==========

  test.describe('Estatísticas', () => {

    test('deve atualizar o total de alunos', async ({ page }) => {
      await page.locator('#nome').fill('Aluno 1');
      await page.locator('#nota1').fill('7');
      await page.locator('#nota2').fill('7');
      await page.locator('#nota3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#stat-total')).toHaveText('1');
    });

  });

});