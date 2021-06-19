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
    getBgBasedOnTime(value1) {
      if (typeof value1 == "undefined") return "bg-dark";
      let seconds = this.dateTimeDiff(value1);
      if (seconds > 86400)
        //1 day
        return "bg-dark";
      else if (seconds > 14400)
        //4 horas
        return "bg-danger";
      else if (seconds > 3600)
        //1 horas
        return "bg-warning";
      else if (seconds > 600)
        //10 minutos
        return "bg-info";
      else if (seconds <= 600)
        //10 minutos
        return "bg-success";
    },

    getBadgeBasedOnTime(value1) {
      if (typeof value1 == "undefined") return "badge-dark";
      let seconds = this.dateTimeDiff(value1);
      if (seconds > 86400)
        //1 day
        return "badge-dark";
      else if (seconds > 14400)
        //4 horas
        return "badge-danger";
      else if (seconds > 3600)
        //1 horas
        return "badge-warning";
      else if (seconds > 600)
        //10 minutos
        return "badge-info";
      else if (seconds <= 600)
        //10 minutos
        return "badge-success";
    },

    getTitleTextBasedOnTime(value1) {
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
  },
};
