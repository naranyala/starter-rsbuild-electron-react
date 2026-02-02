import type { CardProps } from '@renderer/types';
import { createWindowFromMenuItem, type UseCase, useCaseRegistry } from '@renderer/use-cases';
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
    // Look up the use-case from the registry based on the card id
    const { id } = this.props;
    if (id) {
      const useCase = useCaseRegistry.get(id);
      if (useCase) {
        this.setState({ useCase });
      }
    }
  }

  handleCardClick = () => {
    const { id, title, content } = this.props;
    const { useCase } = this.state;

    if (useCase) {
      // Use the modular use-case system
      createWindowFromMenuItem(id || '', title);
    } else {
      // Fallback to legacy behavior
      createWindowFromMenuItem(id || '', title, content);
    }
  };

  render() {
    const { title } = this.props;

    return (
      <button
        type="button"
        className="simple-card"
        onClick={this.handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleCardClick();
          }
        }}
        tabIndex={0}
      >
        <h3 className="simple-card-title">
          {title}
        </h3>
      </button>
    );
  }
}

export default Card;
