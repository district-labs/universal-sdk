'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useEffect, useState } from 'react';

type PWAInstallPrompt = React.HTMLAttributes<HTMLElement>;

export const PWAInstallPrompt = ({ className, children }: PWAInstallPrompt) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window).MSStream,
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  if (isIOS) {
    return (
      <div className={cn(className)}>
        <Dialog>
          <DialogTrigger
            asChild={true}
            className={cn('cursor-pointer', className)}
          >
            {children}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Install Universal Wallet
              </DialogTitle>
              <div className="content">
                <p className="text-sm">
                  Universal Wallet is a Progressive Web App (PWA). You can
                  install it on your device for a native app-like experience.
                </p>
                <h3 className="font-bold text-lg">IOS</h3>
                <ul className="mb-4 list-inside list-disc pl-2">
                  <li>Tap the Share button ⎋ </li>
                  <li>Tap "Add to Home Screen" ➕ </li>
                </ul>
                <p className="text-sm">
                  The Universal Wallet icon will appear on your home screen. Use
                  it to access your wallet anytime and discover what's possible.
                </p>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
};