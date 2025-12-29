type QtyControlProps = {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
};

const QtyControl = ({ qty, onIncrement, onDecrement, disabled }: QtyControlProps) => {
  return (
    <div className="qty-control">
      <button className="qty-btn" type="button" onClick={onDecrement} disabled={disabled}>
        -
      </button>
      <span className="qty-value">{qty}</span>
      <button className="qty-btn" type="button" onClick={onIncrement} disabled={disabled}>
        +
      </button>
    </div>
  );
};

export default QtyControl;
