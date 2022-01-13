import {Native} from '../bridge/native';

export default {
  methods: {
    toast: (msg) => Native.showToast(msg),
    openDrawer: () => Native.openDrawer(),
  },
};
