/* eslint-disable prettier/prettier */
export default {
  methods: {
    dateTimeToString(value, defaultVal = "") {
      if (typeof value == "undefined") return defaultVal;
      let d = new Date(value);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();
      let hour = "" + d.getHours();
      let minutes = "" + d.getMinutes();
      let seconds = "" + d.getSeconds();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      if (hour.length < 2) hour = "0" + hour;
      if (minutes.length < 2) minutes = "0" + minutes;
      if (seconds.length < 2) seconds = "0" + seconds;

      return (
        [day, month, year].join("/") + " " + [hour, minutes, seconds].join(":")
      );
    },

    dateTimeDiff(value1, value2 = null) {
      if (typeof value1 == "undefined") return 0;
      if (value2 == null) value2 = new Date();
      value1 = new Date(value1);
      return Math.abs((value2.getTime() - value1.getTime()) / 1000);
    },
    dateTimeDiffHours(value1, value2, defaultV = "") {
      if (typeof value1 == "undefined" || typeof value2 == "undefined"  ) 
        return defaultV;
      let seconds = this.dateTimeDiff(value1,value2);
      let hours = Math.floor(seconds/(60*60))
      seconds = Math.round(seconds%(60*60))
      let minutes = Math.floor(seconds/60)
      seconds =  Math.round(seconds%60)
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      return [hours, minutes, seconds].join(":");
    },

    getBadgeBasedOnTimeService(value1) {
      if (typeof value1 == "undefined") return "badge-dark";
      let seconds = this.dateTimeDiff(value1);
      if (seconds > 86400)
        //1 day
        return "dark";
      else if (seconds > 14400)
        //4 horas
        return "danger";
      else if (seconds > 3600)
        //1 horas
        return "warning";
      else if (seconds > 600)
        //10 minutos
        return "info";
      else if (seconds <= 600)
        //10 minutos
        return "success";
    },

    getBadgeBasedOnTimeSoftware(value1) {
      if (typeof value1 == "undefined") return "badge-dark";
      let seconds = this.dateTimeDiff(value1);
      if (seconds > 86400 * 30)
        //30 days
        return "danger";
      else if (seconds > 86400 * 7)
        //7 days
        return "warning";
      else if (seconds > 86400)
        //1 day
        return "info";
      else if (seconds <= 86400)
        //1 day
        return "success";
    },

    getTitleTextBasedOnTimeService(value1) {
      if (typeof value1 == "undefined") return "No data";
      let seconds = this.dateTimeDiff(value1);
      if (seconds > 86400)
        //1 day
        return "More than 1 day";
      else if (seconds > 14400)
        //4 horas
        return "More than 4 hours";
      else if (seconds > 3600)
        //1 horas
        return "More than 1 hours";
      else if (seconds > 600)
        //10 minutos
        return "More than 10 minutes";
      else if (seconds <= 600)
        //10 minutos
        return "Less than 10 minutes";
    },
    getTitleTextBasedOnTimeSoftware(value1) {
      if (typeof value1 == "undefined") return "No data";
      let seconds = this.dateTimeDiff(value1);
      if (seconds > 86400 * 30)
        //30 day
        return "More than 30 days";
      else if (seconds > 86400 * 7)
        //7 days
        return "More than 7 days";
      else if (seconds > 86400)
        //1 day
        return "More than 1 day";
      else if (seconds < 86400)
        //1 day
        return "Less than 1 day";
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
};
