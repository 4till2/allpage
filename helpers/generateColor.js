const randomColor = () => {
    let o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + '.1' + ')';
};
export default function generateColors() {
    return [randomColor(), randomColor(), randomColor()]
}
