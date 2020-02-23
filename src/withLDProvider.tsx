import * as React from 'react';
import { defaultReactOptions, ProviderConfig, EnhancedComponent } from './types';
import LDProvider from './LDProvider';

/**
 * `withLDProvider` is a function which accepts a config object which is used to
 * initialize `launchdarkly-js-client-sdk`.
 *
 * This HOC handles passing configuration to the `LDProvider`, which does the following:
 * - It initializes the ldClient instance by calling `launchdarkly-js-client-sdk` initialize on `componentDidMount`
 * - It saves all flags and the ldClient instance in the context API
 * - It subscribes to flag changes and propagate them through the context API
 *
 * The difference between `withLDProvider` and `asyncWithLDProvider` is that `withLDProvider` initializes
 * `launchdarkly-js-client-sdk` at `componentDidMount`. This means your flags and the ldClient are only available after
 * your app has mounted. This can result in a flicker due to flag changes at startup time.
 *
 * `asyncWithLDProvider` initializes `launchdarkly-js-client-sdk` at the entry point of your app prior to render.
 * This means that your flags and the ldClient are ready at the beginning of your app. This ensures your app does not
 * flicker due to flag changes at startup time.
 *
 * @param config - The configuration used to initialize LaunchDarkly's JS SDK
 * @return A function which accepts your root React component and returns a HOC
 */
export function withLDProvider(config: ProviderConfig) {
  return function withLDProviderHoc<P>(WrappedComponent: React.ComponentType<P>) {
    const { reactOptions: userReactOptions } = config;
    const reactOptions = { ...defaultReactOptions, ...userReactOptions };
    const providerProps = { ...config, reactOptions };

    return class extends React.Component<P> {
      render() {
        return (
          <LDProvider {...providerProps}>
            <WrappedComponent {...this.props} />
          </LDProvider>
        );
      }
    };
  };
}

export default withLDProvider;
