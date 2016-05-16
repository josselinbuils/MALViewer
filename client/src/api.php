<?php

$useragent = 'api-indiv-EF3095545BF402BA6BB54BD826D919AD';
$type = isset($_GET['type']) ? htmlspecialchars($_GET['type']) : null;
$login = isset($_GET['login']) ? htmlspecialchars($_GET['login']) : null;
$password = isset($_GET['password']) ? htmlspecialchars($_GET['password']) : (isset($_GET['skey']) ? base64_decode(base64_decode(htmlspecialchars($_GET['skey']))) : null);
$res = '';

switch ($type) {
  case 'add':
    $xml = '<?xml version="1.0" encoding="UTF-8"?>
			<entry>
				<status>' . str_replace(array('watching', 'completed', 'onHold', 'dropped', 'planToWatch'), array(1, 2, 3, 4, 6), htmlspecialchars($_GET['status'])) . '</status>
			</entry>';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/api/animelist/add/' . htmlspecialchars($_GET['id']) . '.xml');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "data=$xml");
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
    $res = curl_exec($ch);
    curl_close($ch);
    break;

  case 'anime':
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/anime/' . htmlspecialchars($_GET['id']));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
    $data = curl_exec($ch);

    preg_match('/<span itemprop="description">(.*)<\/span>/sU', $data, $matches);
    $res['series_synopsis'] = preg_replace('/\n/s', '', $matches[1]);

    preg_match('/<h2>Alternative Titles<\/h2>(.*)<br \/>/sU', $data, $matches);
    $res['series_synonyms'] = substr(preg_replace('/<div[^>]*>[^<]*<span[^>]*>[^<]*<\/span> ([^<]*)\n  <\/div>/s', '$1, ', $matches[1]), 0, -2);

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Type:<\/span>\s*<a[^>]+>([\S ]*)<\/a>[^<]*<\/div>/', $data, $matches);
    $res['series_type'] = $matches[1];

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Status:<\/span>\s*([\S ]*)[^<]*<\/div>/', $data, $matches);
    $res['series_status'] = $matches[1];

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Aired:<\/span>\s*(\S.+) to (\?|\S.+)[^<]*<\/div>/', $data, $matches);
    $res['series_start'] = $matches[1];
    $res['series_end'] = $matches[2] != '?' ? $matches[2] : null;

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Genres:<\/span>\s*([\S ]*)[^<]*<\/div>/', $data, $matches);
    $res['series_genres'] = preg_replace('/,/s', ', ', preg_replace('/ *<[^>]+>/s', '', $matches[1]));

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Rating:<\/span>\s*([\S ]*)[^<]*<\/div>/', $data, $matches);
    $res['series_rating'] = $matches[1];

    preg_match('/<span itemprop="ratingValue">([\.\d]+)<\/span>/', $data, $matches);
    $res['series_score'] = $matches[1];

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Ranked:<\/span>\s*#(\d+)(<sup>\d*<\/sup>)[^<]*<\/div>/', $data, $matches);
    $res['series_rank'] = $matches[1];

    preg_match('/<div[^>]*>[^<]*<span[^>]*>Popularity:<\/span>\s*#(\d+)[^<]*<\/div>/', $data, $matches);
    $res['series_popularityRank'] = $matches[1];

    $res = json_encode($res);

    curl_close($ch);
    break;

  case 'animelist':
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/malappinfo.php?u=' . $login . '&status=all');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
    $data = curl_exec($ch);

    $data = preg_replace('#<myinfo>.*</myinfo>#sU', '', $data);
    $data = str_replace(array('<myStatus>1</myStatus>', '<myStatus>2</myStatus>', '<myStatus>3</myStatus>', '<myStatus>4</myStatus>', '<myStatus>6</myStatus>'), array('<myStatus>watching</myStatus>', '<myStatus>completed</myStatus>', '<myStatus>on-hold</myStatus>', '<myStatus>dropped</myStatus>', '<myStatus>plan to watch</myStatus>'), $data);
    $res = json_encode(simplexml_load_string(xml_entity_decode($data)));
    curl_close($ch);
    break;

  case 'delete':
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/api/animelist/delete/' . htmlspecialchars($_GET['id']) . '.xml');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "");
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
    $res = curl_exec($ch);
    curl_close($ch);
    break;

  case 'edit':
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' .
      '<entry>' .
      '<episode>' . htmlspecialchars($_GET['episodes']) . '</episode>' .
      '<status>' . str_replace(array('watching', 'completed', 'onHold', 'dropped', 'planToWatch'), array(1, 2, 3, 4, 6), htmlspecialchars($_GET['status'])) . '</status>' .
      '<score>' . htmlspecialchars($_GET['score']) . '</score>' .
      (isset($_GET['startDate']) ? '<date_start>' . htmlspecialchars($_GET['startDate']) . '</date_start>' : '') .
      (isset($_GET['endDate']) ? '<date_finish>' . htmlspecialchars($_GET['endDate']) . '</date_finish>' : '') .
      '</entry>';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/api/animelist/update/' . htmlspecialchars($_GET['id']) . '.xml');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "data=$xml");
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
    $res = curl_exec($ch);
    curl_close($ch);
    break;

  case 'history':
    date_default_timezone_set('UTC');

    $toplist = htmlspecialchars($_GET['toplist']);
    $page = htmlspecialchars($_GET['page']);

    if (!$page) {
      $page = 1;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/history/' . $login . '/anime');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);

    preg_match_all("#<tr>[^<]*<td[^>]+><a[^>]+>([^<]+)</a> ep. <strong>([^<]+)</strong></td>[^<]*<td[^>]+> ([^<]+)</td>[^<]*</tr>#sU", curl_exec($ch), $matches, PREG_SET_ORDER);

    $xml = '<myanimelist>';
    $i = 0;

    while ($matches[$i][0]) {
      $time = $matches[$i][3];

      if (strrpos($time, 'ago') !== false) {

        if (strrpos($time, 'second') !== false) {
          $time = time() - intval(preg_replace('#(\d+) seconds? ago#', '$1', $time));

        } else if (strrpos($time, 'minute') !== false) {
          $time = time() - (intval(preg_replace('#(\d+) minutes? ago#', '$1', $time)) * 60);

        } else {
          $time = time() - (intval(preg_replace('#(\d+) hours? ago#', '$1', $time)) * 3600);
        }

        $time = date(DATE_W3C, $time);

      } else if (strrpos($time, 'Yesterday') !== false) {
        $time = date(DATE_W3C, strtotime($time) + 25200); // 7 hours offset to UTC

      } else {
        $time = date(DATE_W3C, strtotime(preg_replace('#(\d+)-(\d+)-(\d+)(.+)#', '$3-$1-$2$4', $time)) + 25200); // 7 hours offset to UTC
      }

      $xml = $xml . '<anime><title>' . $matches[$i][1] . '</title><episode>' . $matches[$i][2] . '</episode><time>' . $time . '</time></anime>';
      $i++;
    }

    $xml = $xml . '</myanimelist>';

    $res = json_encode(simplexml_load_string(xml_entity_decode($xml)));

    curl_close($ch);
    break;

  case 'search':
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/anime.php?q=' . str_replace(' ', '+', htmlspecialchars($_GET['q'])) . '&type=' . htmlspecialchars($_GET['stype']) . '&score=' . htmlspecialchars($_GET['score']) . '&status=' . htmlspecialchars($_GET['status']) . '&r=' . htmlspecialchars($_GET['r']) . '&sm=' . htmlspecialchars($_GET['sm']) . '&sy=' . htmlspecialchars($_GET['sy']) . '&em=' . htmlspecialchars($_GET['em']) . '&ey=' . htmlspecialchars($_GET['ey']));
    curl_setopt($ch, CURLOPT_HEADER, TRUE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);

    $data = curl_exec($ch);

    if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == '303') {
      preg_match('#Location:\s/anime/([^/]+)/\S+\s#sU', $data, $matches);
      $id = $matches[1];

      curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/anime/' . $id);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
      curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
      curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
      curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
      curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);

      $data = curl_exec($ch);

      $xml = '<myanimelist><anime><series_animedb_id>' . $id . '</series_animedb_id>';

      preg_match('#<img src="(http://cdn.myanimelist.net/images/anime/[^"]+)" alt="([^"]+)"[^>]*>#sU', $data, $matches);
      $xml = $xml . '<series_image>' . $matches[1] . '</series_image><series_title>' . $matches[2] . '</series_title>';

      preg_match('#<div[^>]+><span[^>]+>Episodes:</span>[\s]*(\S.+)[\s]*</div>#sU', $data, $matches);
      $xml = $xml . '<series_episodes>' . $matches[1] . '</series_episodes></anime></myanimelist>';

      $res = json_encode(simplexml_load_string(xml_entity_decode($xml)));

    } else {
      $tmpData = $data;

      for ($i = 0; $i < 2 && preg_match('#<a[^>]+>' . ($i + 2) . '</a>#sU', $tmpData) == 1; $i++) { // Load 2 more pages if possible
        curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/anime.php?q=' . str_replace(' ', '+', htmlspecialchars($_GET['q'])) . '&type=' . htmlspecialchars($_GET['stype']) . '&score=' . htmlspecialchars($_GET['score']) . '&status=' . htmlspecialchars($_GET['status']) . '&r=' . htmlspecialchars($_GET['r']) . '&sm=' . htmlspecialchars($_GET['sm']) . '&sy=' . htmlspecialchars($_GET['sy']) . '&em=' . htmlspecialchars($_GET['em']) . '&ey=' . htmlspecialchars($_GET['ey']) . '&show=' . (($i + 1) * 50));
        curl_setopt($ch, CURLOPT_HEADER, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
        curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);

        $tmpData = curl_exec($ch);
        $data = $data . $tmpData;
      }

      $data = preg_replace('/<img src="[^"]+(images[^"]+\.jpg)[^"]*"[^>]+>\s*<\/a>\s*<\/div>\s*<\/td>\s*<td[^>]+>\s*<div[^>]+>\s*<div[^>]+>\s*<\/div>\s*<\/div>\s*<a href="\/anime\/(\d+)\/[^"]+"><strong>([^<]+)<\/strong><\/a>\s*<a[^>]+>[^<]+<\/a>\s*<div[^>]+>\s*<\/div>\s*<div[^>]+>[^<]*(<a[^>]+>[^<]+<\/a>)?[^<]*<\/div>\s*<\/td><td[^>]+>[^<]*<\/td><td[^>]+>([^<]*)<\/td>/s', '<anime><series_animedb_id>$2</series_animedb_id><series_title>$3</series_title><series_image>http://cdn.myanimelist.net/$1</series_image><series_episodes>$5</series_episodes></anime>', $data);

      preg_match_all("/<anime><series_animedb_id>[^<]+<\/series_animedb_id><series_title>[^<]+<\/series_title><series_image>[^<]+<\/series_image><series_episodes>[^<]+<\/series_episodes><\/anime>/sU", $data, $matches, PREG_SET_ORDER);

      $xml = '<myanimelist>';

      for ($i = 0; $matches[$i][0]; $i++) {
        $xml = $xml . $matches[$i][0];
      }

      $xml = $xml . '</myanimelist>';

      $res = json_encode(simplexml_load_string(xml_entity_decode($xml)));
    }
    curl_close($ch);
    break;

  case 'top':
    $toplist = htmlspecialchars($_GET['toplist']);
    $page = htmlspecialchars($_GET['page']);

    if (!$page) {
      $page = 1;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/topanime.php?limit=' . (($page - 1) * 50) . ($toplist ? '&type=' . $toplist : ''));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
    $data = curl_exec($ch);

    $data = preg_replace('/<img[^>]+src="([^"]+)t.jpg"[^>]+>\s*<\/a>\s*<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>[^<]*<\/div>\s*<\/div>\s*<a[^>]*href="[^"]*\/anime\/([^"]*)\/[^>]*>([^<]*)<\/a>\s*<br>\s*<div[^>]*>[^(]*\(([^ ]* )/s', '<anime><series_animedb_id>$2</series_animedb_id><series_title>$3</series_title><series_image>$1.jpg</series_image><series_episodes>$4</series_episodes></anime>', $data);
    preg_match_all("/<anime><series_animedb_id>[^<]+<\/series_animedb_id><series_title>[^<]+<\/series_title><series_image>[^<]+<\/series_image><series_episodes>[^<]+<\/series_episodes><\/anime>/sU", $data, $matches, PREG_SET_ORDER);

    $xml = '<myanimelist>';
    $i = 0;

    while ($matches[$i][0]) {
      $xml = $xml . $matches[$i][0];
      $i++;
    }

    $xml = $xml . '</myanimelist>';

    $res = json_encode(simplexml_load_string(xml_entity_decode($xml)));
    curl_close($ch);
    break;

  case 'verify_credentials':
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://myanimelist.net/api/account/verify_credentials.xml');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
    curl_setopt($ch, CURLOPT_USERPWD, "$login:$password");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);

    $data['res'] = curl_exec($ch);
    $data['skey'] = base64_encode(base64_encode($password));

    $res = json_encode($data);

    curl_close($ch);
    break;
}

echo $res;

function xml_entity_decode($s)
{
  $s = str_replace('&', '&amp;', $s);
  static $XENTITIES = array('&amp;', '&gt;', '&lt;');
  static $XSAFENTITIES = array('#_x_amp#;', '#_x_gt#;', '#_x_lt#;');
  $s = str_replace($XENTITIES, $XSAFENTITIES, $s);
  $s = html_entity_decode($s, ENT_HTML5 | ENT_NOQUOTES, 'UTF-8'); // PHP 5.3+
  $s = str_replace($XSAFENTITIES, $XENTITIES, $s);
  return $s;
}
