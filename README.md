<!--
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-04-10 14:35:58
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-16 01:37:19
-->
# Courier Mobile App Dev Guide

## Installation

### download repo
```
git clone https://github.com/FidesSoft/courierApp.git
```

### get updates from main branch
```
git checkout dev // git checkout dev-ios 
git pull origin main
```

### install packages


```
npm i
```


### edit react-native-multiple-select package.

edit node_modules/react-native-multiple-select/lib/react-native-multi-select.js like below.(set selector true)

```
constructor(props) { 
    super(props); 
    this.state = { 
    selector: true, 
    searchTerm: '' 
    }; 
}

```

### edit react-native-picker-select package.

edit node_modules/react-native-picker-select/src/index.js
Line 161 

```
if (itemsChanged || selectedItemChanged) {
            // this.props.onValueChange(selectedItem.value, idx); // delete this line

            this.setState({
                ...(itemsChanged ? { items } : {}),
                ...(selectedItemChanged ? { selectedItem } : {}),
            });
        }

```

### install pods (ios dev)

```
npx pod-install
```

### start metro bundler

```
rns --reset-cache // npx react-native start --reset-cache
```


### run app on emulator

```
rna // npx react-native run-android
or
rna // npx react-native run-ios
