const isFutureDateTime = (date, time) => {
    const inputDateTime = new Date(`${date}T${time}`);
    alert(date+time)
    alert(inputDateTime)
    return inputDateTime.getTime() > new Date().getTime();
};
export default isFutureDateTime