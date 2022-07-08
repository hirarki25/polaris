import React from 'react';
import {mountWithApp} from 'tests/utilities';

import {Link} from '../../Link';
import {Tooltip} from '../Tooltip';
import {TooltipOverlay} from '../components';
import {Key} from '../../../types';
import * as geometricUtilities from '../../../utilities/geometry';

describe('<Tooltip />', () => {
  it('renders its children', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    expect(tooltip).toContainReactComponent('button');
  });

  it('does not render initially', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );
    expect(tooltip.find(TooltipOverlay)).not.toContainReactComponent('div');
  });

  it('renders initially when active is true', () => {
    const tooltipActive = mountWithApp(
      <Tooltip content="Inner content" active>
        <Link>link content</Link>
      </Tooltip>,
    );
    expect(tooltipActive.find(TooltipOverlay)).toContainReactComponent('div');
  });

  it('renders overlay with a default preventInteraction', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    findWrapperComponent(tooltip)!.trigger('onMouseOver');
    expect(tooltip.find(TooltipOverlay)).toContainReactComponent('div', {
      className: expect.stringContaining('preventInteraction'),
    });
  });

  it('renders on mouseOver', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    findWrapperComponent(tooltip)!.trigger('onMouseOver');
    expect(tooltip.find(TooltipOverlay)).toContainReactComponent('div');
  });

  it('renders on focus', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    findWrapperComponent(tooltip)!.trigger('onFocus');
    expect(tooltip.find(TooltipOverlay)).toContainReactComponent('div');
  });

  it('unrenders its children on blur', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    findWrapperComponent(tooltip)!.trigger('onBlur');
    expect(tooltip.find(TooltipOverlay)).not.toContainReactComponent('div');
  });

  it('unrenders its children on mouseLeave', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    findWrapperComponent(tooltip)!.trigger('onMouseLeave');
    expect(tooltip.find(TooltipOverlay)).not.toContainReactComponent('div');
  });

  it('updates coordinates passed to overlay onMouseMove', () => {
    const tooltip = mountWithApp(
      <Tooltip content="Inner content">
        <Link>link content</Link>
      </Tooltip>,
    );

    jest.spyOn(geometricUtilities, 'getRectForNode').mockImplementation(() => {
      return {
        left: 40,
        top: 10,
        width: 100,
        height: 100,
        center: {x: 20, y: 50},
      };
    });

    findWrapperComponent(tooltip)!.trigger('onMouseOver');
    expect(tooltip.find(TooltipOverlay)).toContainReactComponent('div');
    const childWrapperComponent = findWrapperComponent(tooltip)!.find('span');

    childWrapperComponent!.trigger('onMouseMove', {
      clientX: 120,
      clientY: 80,
    });

    expect(tooltip!.find(TooltipOverlay)!.props.coordinates).toStrictEqual({
      cursorX: 120,
      x: 30,
      y: 20,
    });
  });

  it('closes itself when escape is pressed on keyup', () => {
    const tooltip = mountWithApp(
      <Tooltip active content="This order has shipping labels.">
        <div>Order #1001</div>
      </Tooltip>,
    );

    findWrapperComponent(tooltip)!.trigger('onKeyUp', {
      keyCode: Key.Escape,
    });
    expect(tooltip).toContainReactComponent(TooltipOverlay, {
      active: false,
    });
  });

  it('passes accessibility label to TooltipOverlay', () => {
    const accessibilityLabel = 'accessibility label';

    const tooltip = mountWithApp(
      <Tooltip
        accessibilityLabel={accessibilityLabel}
        content="Inner content"
        active
      >
        <Link>link content</Link>
      </Tooltip>,
    );
    expect(tooltip).toContainReactComponent(TooltipOverlay, {
      accessibilityLabel,
    });
  });
});

function findWrapperComponent(tooltip: any) {
  return tooltip.find('span');
}
