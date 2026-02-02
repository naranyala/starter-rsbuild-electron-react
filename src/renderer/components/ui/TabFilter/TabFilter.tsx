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
    if (prevProps.activeTab !== this.props.activeTab) {
      this.setState({ activeTab: this.props.activeTab });
    }
  }

  handleTabClick = (tabId: string) => {
    this.setState({ activeTab: tabId });
    this.props.onTabChange(tabId);
  };

  render() {
    const { tabs, className, ...rest } = this.props;
    const { activeTab } = this.state;

    return (
      <div className={`tab-filter ${className || ''}`} {...rest}>
        <div className="tab-filter-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => this.handleTabClick(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.handleTabClick(tab.id);
                }
              }}
              tabIndex={0}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default TabFilter;