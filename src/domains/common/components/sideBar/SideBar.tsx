// src/.../SideBar.tsx
import { Drawer, List, ListItem, styled, Typography, Button } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';
import { ColumnBox } from '@shared/ui/layoutUtilComponents';
import { BookingIcon } from '@shared/icons/BookingIcon';
import { InvoiceIcon } from '@shared/icons/InvoiceIcon';
import { LocationIcon } from '@shared/icons/LocationIcon';
import { PersonSerachIcon } from '@shared/icons/PersonSerachIcon';
import { RequestQuoteIcon } from '@shared/icons/RequestQuoteIcon';
import { ScheduleIcon } from '@shared/icons/ScheduleIcon';
import { SerchargeIcon } from '@shared/icons/SerchargeIcon';
import { WarningAmberIcon } from '@shared/icons/WarningAmberIcon';
import React, { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useChatFlow from '@domains/common/hooks/useChatFlow';
import { TestButton } from '@/domains/chatbot/components/button/TestButton';
import useUserStore from '@domains/user/store/user.store';
import type { SupportedLocale } from '@shared/locale/resolve';

enum MenuGroup {
  BOT = 'bot',
  MANUAL = 'manual',
  SUPPORT = 'support',
}

interface MenuItem {
  id: string;
  title: string; // 라벨 (t() 결과)
  icon: ReactNode;
  group: MenuGroup;
}

interface Menu {
  BOT: MenuItem[];
  MANUAL: MenuItem[];
  SUPPORT: MenuItem[];
}

const LOCALE_CYCLE = ['ko-KR', 'en-US', 'zh-CN', 'ja-JP'] as const;

const SideBar = () => {
  // ┣━━━━━━━━━━━━━━━━ GlobalHooks ━━━━━━━━━━━━━━━━┫
  const { t } = useTranslation();
  const { run } = useChatFlow();

  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━━━━━━┫
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setIsSidebarOpen = useUIStore((s) => s.setIsSidebarOpen);
  const globalLocale = useUserStore((s) => s.globalLocale);
  const setGlobalLocale = useUserStore((s) => s.setGlobalLocale);

  // ┣━━━━━━━━━━━━━━━━ Variables ━━━━━━━━━━━━━━━━━━┫
  const MenuInfo: Menu = {
    BOT: [
      {
        id: 'ai-route',
        title: t('sideBar.ai-route', { defaultValue: 'AI 경로 추천' }),
        icon: <ScheduleIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'find-manager',
        title: t('sideBar.find-manager', { defaultValue: '담당자 찾기' }),
        icon: <PersonSerachIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'schedule',
        title: t('sideBar.schedule', { defaultValue: 'Schedule / Cut-off' }),
        icon: <ScheduleIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'sercharge',
        title: t('sideBar.sercharge', { defaultValue: '요율 및 Surcharge' }),
        icon: <SerchargeIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'manual-booking',
        title: t('sideBar.manual-booking', { defaultValue: 'Booking/BL' }),
        icon: <BookingIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'invoice',
        title: t('sideBar.invoice', { defaultValue: 'Invoice' }),
        icon: <InvoiceIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'instant-quote',
        title: t('sideBar.instant-quote', { defaultValue: '즉시 운임 견적 조회' }),
        icon: <RequestQuoteIcon />,
        group: MenuGroup.BOT,
      },
    ],
    MANUAL: [
      {
        id: 'general-cargo',
        title: t('sideBar.general-cargo', { defaultValue: '일반 화물' }),
        icon: <BookingIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'hazardous-special',
        title: t('sideBar.hazardous-special', { defaultValue: '위험물/특수화물' }),
        icon: <WarningAmberIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'hi-quote',
        title: t('sideBar.hi-quote', { defaultValue: 'Hi-Quote' }),
        icon: <RequestQuoteIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'forms',
        title: t('sideBar.forms', { defaultValue: '문서 양식 모음' }),
        icon: <InvoiceIcon />,
        group: MenuGroup.MANUAL,
      },
    ],
    SUPPORT: [
      {
        id: 'connect-agent',
        title: t('globalMenu.connectToAgent', { defaultValue: '상담사연결 (라이브챗)' }),
        icon: <PersonSerachIcon />,
        group: MenuGroup.SUPPORT,
      },
      {
        id: 'chat-history',
        title: t('globalMenu.chatHistory', { defaultValue: '상담 이력' }),
        icon: <PersonSerachIcon />,
        group: MenuGroup.SUPPORT,
      },
      {
        id: 'faq',
        title: t('globalMenu.goToFAQ', { defaultValue: 'FAQ' }),
        icon: <LocationIcon />,
        group: MenuGroup.SUPPORT,
      },
      {
        id: 'language-settings',
        title: t('sideBar.language-settings', { defaultValue: '사용자 언어 설정' }),
        icon: <ScheduleIcon />,
        group: MenuGroup.SUPPORT,
      },
    ],
  };

  // ┣━━━━━━━━━━━━━━━━ Handlers ━━━━━━━━━━━━━━━━━━━┫

  // 사이드바 닫기
  const onClose = () => setIsSidebarOpen(false);

  // 라벨 그대로 발화
  const speak = (utterLabel: string) => {
    run(utterLabel, { simulate: true }); // 유저 메시지로 전송 + LOADING
    onClose();
  };

  // 언어 로테이션 테스트
  const onChangeLangClick = () => {
    const nowIdx = LOCALE_CYCLE.indexOf(globalLocale as (typeof LOCALE_CYCLE)[number]);
    const next = LOCALE_CYCLE[
      (nowIdx === -1 ? 0 : nowIdx + 1) % LOCALE_CYCLE.length
    ] as SupportedLocale;
    setGlobalLocale(next);
  };

  return (
    <StSideBar anchor="left" open={isSidebarOpen} onClose={onClose}>
      <SideBarNav>
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#7EE3F4">
            {t('sideBar.section.bot', { defaultValue: 'HMM Bot' })}
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuInfo.BOT.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => speak(item.title)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>

        {/* 규정/메뉴얼 */}
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#C1B3FA">
            {t('sideBar.section.manual', { defaultValue: '규정/메뉴얼' })}
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuInfo.MANUAL.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => speak(item.title)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>

        {/* 지원/기타 */}
        <ColumnBox>
          <SidebarNav>
            {MenuInfo.SUPPORT.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton
                  onClick={() =>
                    item.id === 'language-settings' ? onChangeLangClick() : speak(item.title)
                  }
                >
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>
      </SideBarNav>

      {/* 테스트: 현재 로캘 표기 */}
      <TestButton onClick={onChangeLangClick}>
        TESTBUTTON 언어바꾸기 (현재: {globalLocale})
      </TestButton>

      <SideBarFooterTypo variant="body3Light">
        2025 HMM All
        <br /> Rights Reserved
      </SideBarFooterTypo>
    </StSideBar>
  );
};

export default SideBar;

const StSideBar = styled(Drawer)(({ theme }) => ({
  '& .MuiBackdrop-root': { background: 'transparent' },
  '& .MuiPaper-root': {
    background: theme.palette.primary.main,
    minWidth: '300px',
    padding: '64px 0 40px 26px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    width: '80%',
  },
}));

const SideBarNav = styled(ColumnBox)({ gap: '48px' });

const SideBarSectionTitle = styled(Typography)((props: { color: string }) => ({
  marginBottom: '8px',
  color: props.color,
}));

const SidebarNav = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const SidebarNavItem = styled(ListItem)({ padding: 0 });

const SidebarNavButton = styled(Button)({
  gap: '8px',
  padding: '8px 0',
  height: 'auto',
  fontSize: 'inherit',
  textTransform: 'none',
  minWidth: 'auto',
  width: '100%',
  justifyContent: 'flex-start',
  '& svg': { width: 20, height: 20 },
});

const SideBarNavTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[200],
}));

const SideBarFooterTypo = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
}));
