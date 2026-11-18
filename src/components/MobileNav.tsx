import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

type Link = { label: string; href: string; current?: boolean };
export default function MobileNav({ links, title, close }: { links: Link[]; title: string; close: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost" className="menu-trigger" aria-label={title}><Menu size={23} /></Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-overlay" />
        <Dialog.Content className="menu-panel" aria-describedby={undefined}>
          <div className="menu-top">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close asChild><Button variant="ghost" aria-label={close}><X size={23} /></Button></Dialog.Close>
          </div>
          <nav aria-label={title}>
            {links.map(({ label, href, current }) => (
              <Dialog.Close key={href} asChild>
                <a href={href} aria-current={current ? 'page' : undefined}>{label}<ArrowUpRight size={19} aria-hidden /></a>
              </Dialog.Close>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
