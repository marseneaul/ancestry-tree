import { describe, expect, it } from 'vitest';
import { createInitialUIState } from './ui-state';

describe('createInitialUIState', () => {
  it('starts with filters and legend visible and secondary panels closed', () => {
    expect(createInitialUIState('dark')).toEqual({
      isStatsDashboardVisible: false,
      isTimelinePanelVisible: false,
      isFilterPanelVisible: true,
      isLegendVisible: true,
      currentTheme: 'dark'
    });
  });
});
