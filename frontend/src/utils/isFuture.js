const isFutureDateTime = (date, time) => {
    const inputDateTime = new Date(`${date}T${time}`);
    return inputDateTime.getTime() > new Date().getTime();
};
export default isFutureDateTime