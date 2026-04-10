import { ReactNode } from 'react';
import { FluentProvider, webDarkTheme, mergeThemes } from '@fluentui/react-components';
import { holoScrollTheme } from '../../styles/fluent-theme';

const theme = mergeThemes(webDarkTheme, holoScrollTheme);

interface FluentLayoutProps {
  children: ReactNode;
}

export function FluentLayout({ children }: FluentLayoutProps) {
  return (
    <FluentProvider theme={theme}>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          backgroundColor: 'var(--colorNeutralBackground1)',
          fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        {children}
      </div>
    </FluentProvider>
  );
}
