/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-04-06 00:23:10
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-06 00:23:10
 */
package com.courierapp;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, R.style.SplashScreenTheme);
      super.onCreate(savedInstanceState);
  }

  protected String getMainComponentName() {
    return "courierApp";
  }
}
