import { MBTangularPage } from './app.po';

describe('mbtangular App', () => {
  let page: MBTangularPage;

  beforeEach(() => {
    page = new MBTangularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
