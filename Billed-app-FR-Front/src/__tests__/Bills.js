/**
 * @jest-environment jsdom
 */

// * Impotation de jest/dom
import '@testing-library/jest-dom'

// * unit test
import userEvent from '@testing-library/user-event'
import Bills from '../containers/Bills.js'
import store from '../__mocks__/store.js'
// import { localStorage } from '../__mocks__/localStorage.js'

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // * Le routeur injecte la classe 'active-icon' quand l'utilisateur est
      // * sur la page 'Bills'
      expect(windowIcon).toHaveClass('active-icon');
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

// = ==========================================================================

describe('handleClickIconEye(icon) Unit Test Suites', () => {


  it('should return something', () => {

    document.body.innerHTML = '';

    const myBill = new Bills({ document, onNavigate, store, localStorage });
    document.body.innerHTML = BillsUI({ data: bills });

    const iconEye = screen.getAllByTestId(`icon-eye`);

    iconEye.forEach(icon => {
      myBill.handleClickIconEye(icon)
      userEvent.click(icon)
      // myBill.handleClickIconEye(icon)
      // expect(myBill.handleClickIconEye(icon)).toHaveBeenCalled()
    })






  });
});

// iconEye.forEach(icon => {
//   icon.addEventListener('click', () => this.handleClickIconEye(icon))
// })

// userEvent.click(iconEdit)