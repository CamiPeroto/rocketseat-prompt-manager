'use client';

import { Input } from '@base-ui/react';
import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useActionState, useRef, useState } from 'react';
import Logo from '../logo/logo';
import { Button } from '../ui/button';
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import PromptList from '../prompts/prompt-list';
import { searchPromptAction } from '@/app/actions/prompt.actions';
import { Spinner } from '../ui/spinner';

export type SidebarContentProps = {
  prompts: PromptSummary[];
};

export default function SidebarContent({ prompts }: SidebarContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(searchPromptAction, {
    success: true,
    prompts: prompts
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery ? (searchState.prompts ?? prompts) : prompts;

  function collapseSidebar() {
    setIsCollapsed(true);
  }

  function extendSidebar() {
    setIsCollapsed(false);
  }

  function handleNewPrompt() {
    router.push('/new');
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/';

      router.push(url, { scroll: false });
      formRef.current?.requestSubmit();
    });
  }

  return (
    <aside className={`border-r border-gray-700 flex flex-col h-full bg-gray-800 transition-[transform,width] duration-300 ease-in-out fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px] ${isCollapsed ? 'md:w-18' : 'md:w-[384px]'}`}>
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="flex items-center justify-center mb-6">
            <Button
              variant={'icon'}
              className={'hidden md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors'}
              title="Expandir sidebar"
              aria-label="Expandir sidebar"
              onClick={extendSidebar}
            >
              <ArrowRightToLine className="w-5 h-5 text-gray-100 " />
            </Button>
          </header>
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleNewPrompt}
              aria-label="Novo prompt"
              title="Novo prompt"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        </section>
      )}

      {!isCollapsed && (
        <>
          <section className="p-6">
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant={'secondary'}
                  aria-label="Fechar menu"
                  title="Fechar menu"
                >
                  <X className="w-5 h-5 text-gray-100" />
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center justify-between mb-6">
              <header className="flex w-full items-center justify-between">
                <Logo />
                <Button
                  onClick={collapseSidebar}
                  variant={'icon'}
                  className={'hidden md:inline-flex p-8 hover:bg-gray-700 focus:outlinr-nonr focus:ring-2 focus-ring-accent-500 rounded-lg transition-colors'}
                  title="Minimizar sidebar"
                  aria-label="Minimizar sidebar"
                >
                  <ArrowLeftToLine className="w-5 h-5 text-gray-50" />
                </Button>
              </header>
            </div>

            <section className="mb-5">
              <form
                ref={formRef}
                action={searchAction}
                className="relative group w-full"
              >
                <Input
                  name="q"
                  value={query}
                  type="text"
                  placeholder="Buscar prompts..."
                  onChange={handleQueryChange}
                  autoFocus
                  className={'w-full p-2 border border-muted/20 rounded-md'}
                />
              </form>
              {isPending && (
                <div
                  title="Carregando prompts"
                  aria-label="Carregando prompts"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-300"
                >
                  <Spinner />
                  <span className="text-xs">Carregando</span>
                </div>
              )}
            </section>
            <div>
              <Button
                onClick={handleNewPrompt}
                className={'w-full'}
                size={'lg'}
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo prompt
              </Button>
            </div>
          </section>
          <nav
            className="flex-1 overflow-auto px-6 pb-6"
            aria-label="Lista de prompts"
          >
            <PromptList
              prompts={promptList}
              aria-label="Lista de prompts"
            />
          </nav>
        </>
      )}
    </aside>
  );
}
