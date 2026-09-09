import SidebarContent, { type SidebarContentProps } from '@/components/sidebar/sidebar-content';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => mockSearchParams
}));

const initialPrompts = [{ id: '1', title: '01', content: 'content 01' }];
function makeSut({ prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps) {
  return render(<SidebarContent prompts={prompts} />);
}

describe('SidebarContent', () => {
  const user = userEvent.setup();

  describe('Base', () => {
    it('should render a new prompt button', () => {
      makeSut();

      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });

    it('Should render the prompts list', () => {
      const input = [
        { id: '1', title: '01', content: 'content 01' },

        { id: '2', title: '02', content: 'content 02' }
      ];
      makeSut({ prompts: input });

      expect(screen.getByText(input[0]?.title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(input.length);
    });

    it('Should update search input when typing', async () => {
      const text = 'ai';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('Colapsar/Expandir', () => {
    it('Should start expanded and show the minimize button', () => {
      makeSut();

      const aside = screen.getByRole('complementary');
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', { name: /minimizar sidebar/i });
      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole('button', { name: /expandir sidebar/i });
      expect(expandButton).not.toBeInTheDocument();
    });

    it(' Should minimize and show the expand button', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', { name: /minimizar sidebar/i });

      await user.click(collapseButton);

      const expandButton = screen.queryByRole('button', { name: /expandir sidebar/i });
      expect(expandButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe('Botão Novo Prompt', () => {
    it('Should redirect the user to the new prompt page, /new route', async () => {
      makeSut();

      const newButton = screen.getByRole('button', { name: 'Novo prompt' });

      await user.click(newButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });

  describe('Busca', () => {
    it('Should navigate with a codified URL when typing or cleaning', async () => {
      const text = 'A B';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/?q=A%20B');

      await user.clear(searchInput);
      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('/');
    });
  });

  it('Should start the search input using search params', () => {
    const text = 'initial';
    const searchParams = new URLSearchParams(`q=${text}`);
    mockSearchParams = searchParams;
    makeSut();

    const searchInput = screen.getByPlaceholderText('Buscar prompts...');

    expect(searchInput).toHaveValue(text);
  });
});
