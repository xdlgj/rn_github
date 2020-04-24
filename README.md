### react-native-vector-icons
yarn add react-native-vector-icons
#### ios
在ios/rn_github/info.plist文件中添加如下内容，然后进入ios 目录执行pod install 
```
<string>6.0</string>
+ <key>UIAppFonts</key>
+ <array>
+    <string>AntDesign.ttf</string>
+    <string>Entypo.ttf</string>
+    <string>EvilIcons.ttf</string>
+    <string>Feather.ttf</string>
+    <string>FontAwesome.ttf</string>
+    <string>FontAwesome5_Brands.ttf</string>
+    <string>FontAwesome5_Regular.ttf</string>
+    <string>FontAwesome5_Solid.ttf</string>
+    <string>Foundation.ttf</string>
+    <string>Ionicons.ttf</string>
+    <string>MaterialIcons.ttf</string>
+    <string>MaterialCommunityIcons.ttf</string>
+    <string>SimpleLineIcons.ttf</string>
+    <string>Octicons.ttf</string>
+    <string>Zocial.ttf</string>
+ </array>
<key>CFBundleName</key>
```
#### android
在android/app/build.gradle文件中添加如下内容
```
apply plugin: "com.android.application"
+ apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

import com.android.build.OutputFile
```