const React = require('../reactGUI/React-shim');

var FontAttributes = React.createClass({
  render: function() {
    let numArray0to52 = [...Array(53).keys()];
    let fontThickness = numArray0to52.map(i => i + 20); // 20~72까지의 숫자 배열.

    return <div id="painterAttrFont" className="entryPlaygroundPainterAttrFont">
        <div className="entryPlaygroundPainterAttrTop">
            <div className="entryPlaygroundPaintAttrTop_"></div>
            <select id="entryPainterAttrFontName" className="entryPlaygroundPainterAttrFontName" size="1">
                <option value="KoPub Batang">바탕체</option>
                <option value="Nanum Myeongjo">명조체</option>
                <option value="Nanum Gothic">고딕체</option>
                <option value="Nanum Pen Script">필기체</option>
                <option value="Jeju Hallasan">한라산체</option>
                <option value="Nanum Gothic Coding">코딩고딕체</option>
            </select>
        </div>
        <div className="painterAttrFontSizeArea">
            <div className="painterAttrFontSizeTop"></div>
            <select id="entryPainterAttrFontSize" className="entryPlaygroundPainterAttrFontSize" size="1">
                { fontThickness.map(size => {
                    return <option value={size}>{size}</option>
                })}
            </select>
        </div>
        <div className="entryPlaygroundPainterAttrFontStyleArea">
            <div className="entryPlaygroundPainterAttrFontTop"></div>
            <select id="entryPainterAttrFontStyle" className="entryPlaygroundPainterAttrFontStyle" size="1">
                <option value="normal">보통</option>
                <option value="bold">굵게</option>
                <option value="italic">기울임</option>
            </select>
        </div>
    </div>
  }
});

module.exports = FontAttributes;
