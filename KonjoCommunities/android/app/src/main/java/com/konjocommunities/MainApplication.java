package com.konjocommunities;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.clipsub.RNShake.RNShakeEventPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new GeolocationPackage(),
            new RNDeviceInfo(),
            new RNSensitiveInfoPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new RNShakeEventPackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
