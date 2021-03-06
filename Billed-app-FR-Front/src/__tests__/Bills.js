/**
 * @jest-environment jsdom
 */

// * Impotation de jest/dom
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import Bills from '../containers/Bills.js';
import store from '../app/Store';

import { screen, waitFor } from '@testing-library/dom';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH, ROUTES } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import router from '../app/Router.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      // * Le routeur injecte la classe 'active-icon' quand l'utilisateur est
      // * sur la page 'Bills'
      expect(windowIcon).toHaveClass('active-icon');
    });

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    // ********* Ligne 27 handleClickNewBill()
    describe("When I click on button 'new bill'", () => {
      test('Then we should be redirect to the new bill page', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({
            pathname,
          });
        };
        const bills = new Bills({ document, onNavigate, store, localStorage });
        document.body.innerHTML = BillsUI({ data: bills });
        const newBillButton = screen.getByTestId('btn-new-bill');
        newBillButton.addEventListener('click', bills.handleClickNewBill());
        userEvent.click(newBillButton);
        expect(screen.getByTestId('form-new-bill')).toBeTruthy();
      });
    });
  });
});
