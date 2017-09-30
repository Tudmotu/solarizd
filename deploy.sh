if [ ! -f aws-profile ]; then
    echo "Unable to locate ./aws-profile file"
    exit 1
fi
PROFILE=$(cat aws-profile)
./build.sh
aws s3 cp --recursive target/ s3://app.solarizd.com/ --profile $PROFILE
