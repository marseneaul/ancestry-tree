export interface UIState {
  isStatsDashboardVisible: boolean;
  isTimelinePanelVisible: boolean;
  isFilterPanelVisible: boolean;
  isLegendVisible: boolean;
  currentTheme: string;
}

export function createInitialUIState(currentTheme: string): UIState {
  return {
    isStatsDashboardVisible: false,
    isTimelinePanelVisible: false,
    isFilterPanelVisible: true,
    isLegendVisible: true,
    currentTheme
  };
}
