module.exports = (mongoose) => {
  const Temple = mongoose.model(
    'temples',
    mongoose.Schema(
      {
        temple_id: Number,
        name: String,
        description: String,
        location: String,
        dedicated: String,
        additionalInfo: Boolean,
      },
      { timestamps: true }
    )
  );

  return Temple;
};
