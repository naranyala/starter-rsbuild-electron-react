import { SimpleCard, SimpleCardTitle } from '@renderer/lib/styled';
import type { CardProps } from '@renderer/types';
import { createFullscreenWindow, type UseCase, useCaseRegistry } from '@renderer/use-cases';
import { Component } from 'react';

interface CardState {
  useCase: UseCase | null;
}

class Card extends Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      useCase: null,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      const useCase = useCaseRegistry.get(id);
      if (useCase) {
        this.setState({ useCase });
      }
    }
  }

  handleCardClick = async () => {
    const { id, title, content, onClick } = this.props;
    const { useCase } = this.state;

    console.log('Card clicked:', { id, title, useCaseExists: !!useCase });

    try {
      if (useCase) {
        await createFullscreenWindow(id || '', title);
      } else {
        await createFullscreenWindow(id || '', title, content);
      }

      // Dispatch event to notify the global store
      const globalWindow = typeof window !== 'undefined' ? window : ({} as Window);
      const event = new CustomEvent('focus-window', {
        detail: { id: id || '', title },
      });
      globalWindow.dispatchEvent(event);

      if (onClick) {
        onClick(id || '', title);
      }
    } catch (error) {
      console.error('Failed to create window:', error);
    }
  };

  render() {
    const { title } = this.props;

    return (
      <SimpleCard
        type="button"
        onClick={this.handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleCardClick();
          }
        }}
        tabIndex={0}
      >
        <SimpleCardTitle>{title}</SimpleCardTitle>
      </SimpleCard>
    );
  }
}

export default Card;
