import { TabFilterContainer, TabFilterInner, TabItem } from '@renderer/lib/styled';
import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { Component } from 'react';

interface TabFilterProps extends ComponentPropsWithoutRef<'div'> {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface TabFilterState {
  activeTab: string;
}

class TabFilter extends Component<TabFilterProps, TabFilterState> {
  constructor(props: TabFilterProps) {
    super(props);
    this.state = {
      activeTab: props.activeTab || props.tabs[0]?.id || '',
    };
  }

  componentDidUpdate(prevProps: TabFilterProps) {
    if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab) {
      this.setState({ activeTab: this.props.activeTab });
    }
  }

  handleTabClick = (tabId: string) => {
    this.setState({ activeTab: tabId });
    this.props.onTabChange(tabId);
  };

  render() {
    const { tabs, className, activeTab, onTabChange, ...rest } = this.props;
    const { activeTab: stateActiveTab } = this.state;
    const currentActiveTab = activeTab || stateActiveTab;

    return (
      <TabFilterContainer className={clsx(className)} {...rest}>
        <TabFilterInner>
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              type="button"
              $isActive={currentActiveTab === tab.id}
              onClick={() => this.handleTabClick(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.handleTabClick(tab.id);
                }
              }}
              tabIndex={0}
              aria-selected={currentActiveTab === tab.id}
              role="tab"
            >
              {tab.label}
            </TabItem>
          ))}
        </TabFilterInner>
      </TabFilterContainer>
    );
  }
}

export default TabFilter;
