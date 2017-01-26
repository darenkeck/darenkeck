import { DarenKeckPage } from './app.po';

describe('daren-keck App', function() {
  let page: DarenKeckPage;

  beforeEach(() => {
    page = new DarenKeckPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
